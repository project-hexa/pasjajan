<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\OrderItem;
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

            // Generate unique order code
            $orderCode = $this->generateOrderCode();

            // Create order
            $order = Order::create([
                'code' => $orderCode,
                'customer_id' => $request->customer_id,
                'address_id' => $request->address_id ?? null,
                'store_id' => $request->store_id ?? null,
                'voucher_id' => $request->voucher_id ?? null,
                'customer_name' => $request->customer_name,
                'customer_email' => $request->customer_email,
                'customer_phone' => $request->customer_phone ?? null,
                'shipping_address' => $request->shipping_address,
                'shipping_recipient_name' => $request->shipping_recipient_name,
                'shipping_recipient_phone' => $request->shipping_recipient_phone,
                'sub_total' => $request->sub_total,
                'discount' => $request->discount ?? 0,
                'shipping_fee' => $request->shipping_fee,
                'admin_fee' => $request->admin_fee ?? 0,
                'grand_total' => $request->grand_total,
                'status' => 'pending',
                'payment_status' => 'unpaid',
                'expired_at' => now()->addMinutes(3), // Order expire 24 jam
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
                    'expired_at' => $order->expired_at->toIso8601String(),
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
            $order = Order::with(['items', 'paymentMethod'])
                ->where('code', $code)
                ->firstOrFail();

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
                    'notes' => $order->notes,
                    'created_at' => $order->created_at->toIso8601String(),
                    'items' => $order->items->map(function ($item) {
                        return [
                            'product_id' => $item->product_id,
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
            $customerId = $request->query('customer_id');
            $status = $request->query('status');
            $paymentStatus = $request->query('payment_status');
            $perPage = $request->query('per_page', 10);

            $query = Order::with(['items', 'paymentMethod'])
                ->orderBy('created_at', 'desc');

            if ($customerId) {
                $query->where('customer_id', $customerId);
            }

            if ($status) {
                $query->where('status', $status);
            }

            if ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
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
            $order = Order::where('code', $code)->firstOrFail();

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
}
