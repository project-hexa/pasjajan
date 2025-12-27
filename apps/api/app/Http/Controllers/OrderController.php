<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Voucher;
use App\Models\CustomerVoucher;
use App\Models\HistoryPoint;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Checkout - Create new order
     * 
     * @param CheckoutRequest $request
     * @return JsonResponse
     */
    public function checkout(CheckoutRequest $request)
    {
        try {
            DB::beginTransaction();

            // Ambil customer dari user yang login
            $user = $request->user();
            $customer = $user->customer;

            if (!$customer) {
                return ApiResponse::error('User tidak memiliki profil customer', 400);
            }

            // Ambil data customer dari User (snapshot)
            $customerName = $user->full_name;
            $customerEmail = $user->email;
            $customerPhone = $user->phone_number;

            // Ambil data shipping dari Address jika address_id dikirim
            $shippingAddress = null;
            $shippingRecipientName = null;
            $shippingRecipientPhone = null;

            if ($request->address_id) {
                $address = Address::where('id', $request->address_id)
                    ->where('customer_id', $customer->id) // Pastikan address milik customer
                    ->first();

                if (!$address) {
                    return ApiResponse::error('Alamat tidak ditemukan atau bukan milik Anda', 400);
                }

                $shippingAddress = $address->detail_address;
                $shippingRecipientName = $address->recipient_name;
                $shippingRecipientPhone = $address->phone_number;
            } else {
                // Fallback ke request jika tidak ada address_id (custom address)
                $shippingAddress = $request->shipping_address;
                $shippingRecipientName = $request->shipping_recipient_name;
                $shippingRecipientPhone = $request->shipping_recipient_phone;
            }

            // Validasi shipping address harus ada
            if (!$shippingAddress || !$shippingRecipientName || !$shippingRecipientPhone) {
                return ApiResponse::error('Data alamat pengiriman tidak lengkap', 400);
            }

            // Validasi dan proses voucher jika ada
            $voucherId = null;
            $voucherDiscount = 0;
            $customerVoucher = null;

            if ($request->voucher_id) {
                // Cek voucher exists dan masih available
                $voucher = Voucher::available()->find($request->voucher_id);

                if (!$voucher) {
                    return ApiResponse::error('Voucher tidak valid atau sudah expired', 400);
                }

                // Cek voucher dimiliki customer dan belum dipakai
                $customerVoucher = CustomerVoucher::where('customer_id', $customer->id)
                    ->where('voucher_id', $voucher->id)
                    ->where('is_used', false)
                    ->first();

                if (!$customerVoucher) {
                    return ApiResponse::error('Voucher tidak ditemukan atau sudah digunakan', 400);
                }

                $voucherId = $voucher->id;
                $voucherDiscount = (float) $voucher->discount_value;
            }

            // Hitung ulang grand_total dengan voucher discount dari BE
            $discount = $voucherDiscount;
            $grandTotal = ($request->sub_total + $request->shipping_fee + ($request->admin_fee ?? 0)) - $discount;
            if ($grandTotal < 0) $grandTotal = 0;

            // Generate unique order code
            $orderCode = $this->generateOrderCode();

            // Create order dengan snapshot data
            $order = Order::create([
                'code' => $orderCode,
                'customer_id' => $customer->id,
                'address_id' => $request->address_id ?? null,
                'store_id' => $request->store_id ?? null,
                'voucher_id' => $voucherId,
                'customer_name' => $customerName,
                'customer_email' => $customerEmail,
                'customer_phone' => $customerPhone,
                'shipping_address' => $shippingAddress,
                'shipping_recipient_name' => $shippingRecipientName,
                'shipping_recipient_phone' => $shippingRecipientPhone,
                'sub_total' => $request->sub_total,
                'discount' => $discount,
                'shipping_fee' => $request->shipping_fee,
                'admin_fee' => $request->admin_fee ?? 0,
                'grand_total' => $grandTotal,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'expired_at' => null, // Akan di-set saat payment process
                'notes' => $request->notes ?? null,
            ]);

            // Create order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'sub_total' => $item['price'] * $item['quantity'],
                ]);
            }

            // Mark voucher sebagai used jika ada
            if ($customerVoucher) {
                $customerVoucher->update([
                    'is_used' => true,
                    'used_at' => now(),
                ]);
            }

            DB::commit();

            // Load items relationship
            $order->load('items');

            return ApiResponse::success([
                'order' => [
                    'id' => $order->id,
                    'code' => $order->code,
                    'grand_total' => $order->grand_total,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'items_count' => $order->items->count(),
                    'expired_at' => $order->expired_at?->toIso8601String(),
                    'created_at' => $order->created_at->toIso8601String(),
                ],
            ], 'Order berhasil dibuat. Silakan pilih metode pembayaran.', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout Error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return ApiResponse::serverError('Gagal membuat order: ' . $e->getMessage());
        }
    }

    /**
     * Get order detail
     * 
     * @param string $code
     * @return JsonResponse
     */
    public function getOrder(string $code)
    {
        try {
            // Ambil customer dari user yang login
            $user = request()->user();
            $customer = $user->customer;

            $order = Order::with(['items.product', 'paymentMethod', 'store', 'voucher'])
                ->where('code', $code)
                ->where('customer_id', $customer->id) // Ownership check
                ->firstOrFail();

            // Auto-sync dengan Midtrans jika order pending dan punya midtrans_order_id
            if ($order->payment_status === 'pending' && $order->midtrans_order_id) {
                try {
                    $midtransService = new \App\Services\MidtransService();
                    $result = $midtransService->getTransactionStatus($order->midtrans_order_id);

                    if ($result->success) {
                        $paymentStatus = $this->mapMidtransStatus(
                            $result->data->transaction_status,
                            $result->data->fraud_status ?? null
                        );

                        if ($order->payment_status !== $paymentStatus) {
                            $updateData = ['payment_status' => $paymentStatus];

                            if ($paymentStatus === 'paid' && !$order->paid_at) {
                                $updateData['paid_at'] = now();
                                $updateData['status'] = 'confirmed';

                                // Give points to customer (1 point per Rp 1.000)
                                $this->awardPointsToCustomer($order);
                            }

                            if (in_array($paymentStatus, ['expired', 'failed'])) {
                                $updateData['status'] = 'cancelled';
                                $this->restoreVoucherIfUsed($order);
                            }

                            $order->update($updateData);
                            $order->refresh();

                            Log::info("Order {$order->code} synced from Midtrans: {$paymentStatus}");
                        }
                    }
                } catch (\Exception $e) {
                    Log::warning("Failed to sync Midtrans status for order {$order->code}: " . $e->getMessage());
                }
            }

            // Auto-update jika order sudah expired tapi status belum diupdate
            if (in_array($order->payment_status, ['pending', 'unpaid']) && $order->status === 'pending') {
                $isExpired = false;

                // Check berdasarkan expired_at
                if ($order->expired_at && now()->gt($order->expired_at)) {
                    $isExpired = true;
                }
                // Fallback: jika tidak ada expired_at, cek created_at > 1 jam
                elseif (!$order->expired_at && now()->subHour()->gt($order->created_at)) {
                    $isExpired = true;
                }

                if ($isExpired) {
                    // Restore voucher sebelum update status
                    $this->restoreVoucherIfUsed($order);

                    $order->update([
                        'status' => 'cancelled',
                        'payment_status' => 'expired',
                    ]);
                    $order->refresh(); // Reload data setelah update
                }
            }

            return ApiResponse::success([
                'order' => [
                    'id' => $order->id,
                    'code' => $order->code,
                    'customer_id' => $order->customer_id,
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'customer_phone' => $order->customer_phone,
                    'shipping_address' => $order->shipping_address,
                    'shipping_recipient_name' => $order->shipping_recipient_name,
                    'shipping_recipient_phone' => $order->shipping_recipient_phone,
                    'sub_total' => $order->sub_total,
                    'discount' => $order->discount,
                    'shipping_fee' => $order->shipping_fee,
                    'admin_fee' => $order->admin_fee,
                    'grand_total' => $order->grand_total,
                    'payment_method' => $order->paymentMethod ? [
                        'id' => $order->paymentMethod->id,
                        'name' => $order->paymentMethod->method_name,
                        'code' => $order->paymentMethod->code,
                        'category' => $order->paymentMethod->payment_type,
                    ] : null,
                    'payment_instructions' => $order->payment_instructions,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'paid_at' => $order->paid_at?->toIso8601String(),
                    'expired_at' => $order->expired_at?->toIso8601String(),
                    'store_id' => $order->store_id,
                    'store_name' => $order->store?->name,
                    'voucher' => $order->voucher ? [
                        'id' => $order->voucher->id,
                        'code' => $order->voucher->code,
                        'name' => $order->voucher->name,
                        'discount_value' => $order->voucher->discount_value,
                    ] : null,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at->toIso8601String(),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_id' => $item->product_id,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'price' => $item->product->price,
                                'image_url' => $item->product->image_url,
                            ] : null,
                            'price' => $item->price,
                            'quantity' => $item->quantity,
                            'sub_total' => $item->sub_total,
                        ];
                    }),
                ],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound('Order tidak ditemukan');
        } catch (\Exception $e) {
            Log::error('Get Order Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengambil data order');
        }
    }

    /**
     * Get orders list (for customer)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getOrders(Request $request)
    {
        try {
            // Ambil customer dari user yang login
            $user = $request->user();
            $customer = $user->customer;

            if (!$customer) {
                return ApiResponse::error('User tidak memiliki profil customer', 400);
            }

            // Auto-update expired orders sebelum fetch
            // Case 1: Orders dengan expired_at yang sudah lewat
            $expiredOrders1 = Order::where('customer_id', $customer->id)
                ->whereIn('payment_status', ['pending', 'unpaid'])
                ->where('status', 'pending')
                ->whereNotNull('expired_at')
                ->where('expired_at', '<', now())
                ->get();

            foreach ($expiredOrders1 as $expiredOrder) {
                $this->restoreVoucherIfUsed($expiredOrder);
                $expiredOrder->update([
                    'status' => 'cancelled',
                    'payment_status' => 'expired',
                ]);
            }

            // Case 2: Orders tanpa expired_at, tapi created_at sudah lebih dari 1 jam
            $expiredOrders2 = Order::where('customer_id', $customer->id)
                ->whereIn('payment_status', ['pending', 'unpaid'])
                ->where('status', 'pending')
                ->whereNull('expired_at')
                ->where('created_at', '<', now()->subHour())
                ->get();

            foreach ($expiredOrders2 as $expiredOrder) {
                $this->restoreVoucherIfUsed($expiredOrder);
                $expiredOrder->update([
                    'status' => 'cancelled',
                    'payment_status' => 'expired',
                ]);
            }

            $status = $request->query('status');
            $paymentStatus = $request->query('payment_status');
            $perPage = $request->query('per_page', 10);
            $search = $request->query('search');

            $query = Order::with(['items.product', 'paymentMethod', 'voucher'])
                ->where('customer_id', $customer->id) // Auto-filter by logged-in customer
                ->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            if ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%");
                });
            }

            $orders = $query->paginate($perPage);

            // Format response with product details
            $formattedOrders = $orders->getCollection()->map(function ($order) {
                return [
                    'id' => $order->id,
                    'code' => $order->code,
                    'customer_id' => $order->customer_id,
                    'customer_name' => $order->customer_name,
                    'customer_email' => $order->customer_email,
                    'customer_phone' => $order->customer_phone,
                    'shipping_address' => $order->shipping_address,
                    'shipping_recipient_name' => $order->shipping_recipient_name,
                    'shipping_recipient_phone' => $order->shipping_recipient_phone,
                    'sub_total' => $order->sub_total,
                    'discount' => $order->discount,
                    'shipping_fee' => $order->shipping_fee,
                    'admin_fee' => $order->admin_fee,
                    'grand_total' => $order->grand_total,
                    'payment_method' => $order->paymentMethod ? [
                        'id' => $order->paymentMethod->id,
                        'name' => $order->paymentMethod->method_name,
                        'code' => $order->paymentMethod->code,
                        'category' => $order->paymentMethod->payment_type,
                    ] : null,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'paid_at' => $order->paid_at?->toIso8601String(),
                    'expired_at' => $order->expired_at?->toIso8601String(),
                    'store_id' => $order->store_id,
                    'voucher' => $order->voucher ? [
                        'id' => $order->voucher->id,
                        'code' => $order->voucher->code,
                        'name' => $order->voucher->name,
                        'discount_value' => $order->voucher->discount_value,
                    ] : null,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at->toIso8601String(),
                    'updated_at' => $order->updated_at->toIso8601String(),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_id' => $item->product_id,
                            'product' => $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'image_url' => $item->product->image_url,
                                'price' => $item->product->price,
                            ] : null,
                            'price' => $item->price,
                            'quantity' => $item->quantity,
                            'sub_total' => $item->sub_total,
                        ];
                    }),
                ];
            });

            return ApiResponse::success([
                'orders' => $formattedOrders->values()->all(),
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Get Orders Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengambil daftar order');
        }
    }

    /**
     * Get recent orders (for staff)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getRecentOrders(Request $request)
    {
        try {
            $limit = $request->query('limit', 20);
            $status = $request->query('status');
            $paymentStatus = $request->query('payment_status');

            $query = Order::with(['items', 'paymentMethod'])
                ->orderBy('created_at', 'desc')
                ->limit($limit);

            if ($status) {
                $query->where('status', $status);
            }

            if ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            }

            $orders = $query->get();

            return ApiResponse::success([
                'orders' => $orders,
                'count' => $orders->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Get Recent Orders Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengambil order terbaru');
        }
    }

    /**
     * Get orders for admin dashboard
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getOrdersForAdmin(Request $request)
    {
        try {
            $perPage = $request->query('per_page', 20);
            $status = $request->query('status');
            $paymentStatus = $request->query('payment_status');
            $dateFrom = $request->query('date_from');
            $dateTo = $request->query('date_to');
            $search = $request->query('search');

            $query = Order::with(['items', 'paymentMethod'])
                ->orderBy('created_at', 'desc');

            if ($status) {
                $query->where('status', $status);
            }

            if ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            }

            if ($dateFrom) {
                $query->whereDate('created_at', '>=', $dateFrom);
            }

            if ($dateTo) {
                $query->whereDate('created_at', '<=', $dateTo);
            }

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('code', 'like', "%{$search}%")
                        ->orWhere('customer_name', 'like', "%{$search}%")
                        ->orWhere('customer_email', 'like', "%{$search}%");
                });
            }

            $orders = $query->paginate($perPage);

            return ApiResponse::success([
                'orders' => $orders->items(),
                'pagination' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Get Admin Orders Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengambil data order');
        }
    }

    /**
     * Get order statistics (for admin)
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function getStatistics(Request $request)
    {
        try {
            $dateFrom = $request->query('date_from', now()->startOfMonth());
            $dateTo = $request->query('date_to', now()->endOfMonth());

            $stats = [
                'total_orders' => Order::whereBetween('created_at', [$dateFrom, $dateTo])->count(),
                'total_revenue' => Order::whereBetween('created_at', [$dateFrom, $dateTo])
                    ->where('payment_status', 'paid')
                    ->sum('grand_total'),
                'pending_orders' => Order::where('status', 'pending')->count(),
                'unpaid_orders' => Order::where('payment_status', 'unpaid')->count(),
                'paid_orders' => Order::where('payment_status', 'paid')->count(),
                'by_status' => Order::whereBetween('created_at', [$dateFrom, $dateTo])
                    ->select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
                'by_payment_status' => Order::whereBetween('created_at', [$dateFrom, $dateTo])
                    ->select('payment_status', DB::raw('count(*) as count'))
                    ->groupBy('payment_status')
                    ->get(),
            ];

            return ApiResponse::success($stats);
        } catch (\Exception $e) {
            Log::error('Get Statistics Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengambil statistik');
        }
    }

    /**
     * Cancel order
     * 
     * @param string $code
     * @return JsonResponse
     */
    public function cancelOrder(string $code)
    {
        try {
            // Ambil customer dari user yang login
            $user = request()->user();
            $customer = $user->customer;

            $order = Order::where('code', $code)
                ->where('customer_id', $customer->id) // Ownership check
                ->firstOrFail();

            // Validasi apakah order bisa di-cancel
            if (!$order->canBeCancelled()) {
                return ApiResponse::error(
                    'Order tidak dapat dibatalkan. Status: ' . $order->status,
                    400
                );
            }

            // Cancel via Midtrans jika sudah ada payment
            if ($order->midtrans_order_id) {
                $midtransService = new \App\Services\MidtransService();
                $result = $midtransService->cancelTransaction($order->midtrans_order_id);

                if (!$result->success) {
                    Log::warning('Failed to cancel Midtrans transaction: ' . $result->message);
                }
            }

            // Restore voucher jika ada
            $this->restoreVoucherIfUsed($order);

            // Update status di database
            $order->update([
                'status' => 'cancelled',
                'payment_status' => 'expired',
            ]);

            return ApiResponse::success([
                'code' => $order->code,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
            ], 'Order berhasil dibatalkan');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound('Order tidak ditemukan');
        } catch (\Exception $e) {
            Log::error('Cancel Order Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal membatalkan order');
        }
    }

    /**
     * Generate unique order code
     * Format: PJ-YYYYMMDD-XXXXX
     * 
     * @return string
     */
    private function generateOrderCode(): string
    {
        $prefix = 'PJ';
        $date = date('Ymd');
        $random = strtoupper(Str::random(5));

        $code = "{$prefix}-{$date}-{$random}";

        // Check if exists, regenerate if duplicate
        while (Order::where('code', $code)->exists()) {
            $random = strtoupper(Str::random(5));
            $code = "{$prefix}-{$date}-{$random}";
        }

        return $code;
    }

    /**
     * Get payment receipt data for an order
     * 
     * @param string $code
     * @return JsonResponse
     */
    public function getPaymentReceipt(string $code)
    {
        try {
            // Ambil customer dari user yang login
            $user = request()->user();
            $customer = $user->customer;

            $order = Order::with(['items.product', 'paymentMethod', 'customer.user'])
                ->where('code', $code)
                ->where('customer_id', $customer->id) // Ownership check
                ->firstOrFail();

            // Validasi order sudah dibayar
            if (!$order->isPaid()) {
                return ApiResponse::error(
                    'Bukti pembayaran hanya tersedia untuk order yang sudah dibayar. Status pembayaran: ' . $order->payment_status,
                    400
                );
            }

            // Format items dengan nomor urut
            $items = $order->items->map(function ($item, $index) {
                return [
                    'no' => $index + 1,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name ?? 'Produk #' . $item->product_id,
                    'product_image' => $item->product->image_url ?? null,
                    'price' => (float) $item->price,
                    'quantity' => $item->quantity,
                    'sub_total' => (float) $item->sub_total,
                ];
            });

            $receipt = [
                'order_code' => $order->code,
                'status_message' => 'Telah berhasil dibayar',
                'customer' => [
                    'name' => $order->customer_name,
                    'address' => $order->shipping_address,
                    'recipient_name' => $order->shipping_recipient_name,
                    'phone' => $order->shipping_recipient_phone ?? $order->customer_phone,
                ],
                'payment' => [
                    'paid_at' => $order->paid_at?->toIso8601String(),
                    'paid_at_formatted' => $order->paid_at?->format('H:i | d F Y'),
                    'payment_method' => $order->paymentMethod?->method_name ?? 'Unknown',
                    'payment_method_code' => $order->paymentMethod?->code ?? null,
                ],
                'items' => $items,
                'summary' => [
                    'sub_total' => (float) $order->sub_total,
                    'discount' => (float) $order->discount,
                    'shipping_fee' => (float) $order->shipping_fee,
                    'admin_fee' => (float) $order->admin_fee,
                    'grand_total' => (float) $order->grand_total,
                ],
                'created_at' => $order->created_at->toIso8601String(),
            ];

            return ApiResponse::success([
                'receipt' => $receipt,
            ], 'Bukti pembayaran berhasil diambil');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound('Order tidak ditemukan atau bukan milik Anda');
        } catch (\Exception $e) {
            Log::error('Get Payment Receipt Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengambil bukti pembayaran');
        }
    }

    /**
     * Restore voucher jika order di-cancel atau expired
     * Mengembalikan voucher ke status belum terpakai
     * 
     * @param Order $order
     * @return void
     */
    private function restoreVoucherIfUsed(Order $order): void
    {
        if (!$order->voucher_id) {
            return;
        }

        try {
            $customerVoucher = CustomerVoucher::where('customer_id', $order->customer_id)
                ->where('voucher_id', $order->voucher_id)
                ->where('is_used', true)
                ->first();

            if ($customerVoucher) {
                $customerVoucher->update([
                    'is_used' => false,
                    'used_at' => null,
                ]);

                Log::info("Voucher restored for cancelled/expired order", [
                    'order_code' => $order->code,
                    'voucher_id' => $order->voucher_id,
                    'customer_voucher_id' => $customerVoucher->id,
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Failed to restore voucher for order {$order->code}: " . $e->getMessage());
        }
    }

    /**
     * Map Midtrans status to our payment_status
     * 
     * @param string $transactionStatus
     * @param string|null $fraudStatus
     * @return string
     */
    private function mapMidtransStatus(string $transactionStatus, ?string $fraudStatus): string
    {
        if ($transactionStatus == 'capture') {
            return ($fraudStatus == 'accept') ? 'paid' : 'pending';
        } elseif ($transactionStatus == 'settlement') {
            return 'paid';
        } elseif (in_array($transactionStatus, ['cancel', 'deny'])) {
            return 'failed';
        } elseif ($transactionStatus == 'expire') {
            return 'expired';
        } elseif ($transactionStatus == 'pending') {
            return 'pending';
        } else {
            return 'failed';
        }
    }

    /**
     * Award points to customer based on transaction amount
     * 1 point per Rp 1.000
     * 
     * @param Order $order
     * @return void
     */
    private function awardPointsToCustomer(Order $order): void
    {
        try {
            $order->load('customer');
            $customer = $order->customer;

            if (!$customer) {
                Log::warning("Cannot award points: customer not found for order {$order->code}");
                return;
            }

            // Calculate points: 1 point per Rp 1.000
            $pointsEarned = (int) floor($order->grand_total / 1000);

            if ($pointsEarned <= 0) {
                return;
            }

            // Add points to customer
            $customer->point += $pointsEarned;
            $customer->save();

            // Create history point record
            HistoryPoint::create([
                'customer_id' => $customer->id,
                'type' => 'Masuk',
                'notes' => "Poin dari transaksi #{$order->code}",
                'total_point' => $pointsEarned,
            ]);

            Log::info("Points awarded to customer", [
                'order_code' => $order->code,
                'customer_id' => $customer->id,
                'points_earned' => $pointsEarned,
                'new_balance' => $customer->point,
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to award points for order {$order->code}: " . $e->getMessage());
        }
    }
}
