<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessPaymentRequest;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Notification;
use App\Models\Voucher;
use App\Models\CustomerVoucher;
use App\Models\HistoryPoint;
use App\Services\MidtransService;
use App\Mail\NotificationMail;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Get available payment methods from database
     * 
     * @return JsonResponse
     */
    public function getPaymentMethods()
    {
        try {
            $paymentMethods = PaymentMethod::active()
                ->get()
                ->map(function ($method) {
                    return [
                        'id' => $method->id,
                        'code' => $method->code,
                        'name' => $method->method_name,
                        'category' => $method->payment_type,
                        'icon' => $method->icon_url,
                        'fee' => $method->fee,
                        'min_amount' => $method->min_amount,
                        'max_amount' => $method->max_amount,
                    ];
                });

            // Group by category
            $grouped = $paymentMethods->groupBy('category');

            return ApiResponse::success([
                'payment_methods' => $paymentMethods,
                'grouped' => $grouped,
                'total' => $paymentMethods->count(),
            ], 'Daftar metode pembayaran berhasil diambil');
        } catch (\Exception $e) {
            Log::error('Get Payment Methods Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengambil daftar metode pembayaran');
        }
    }

    /**
     * Process payment with selected method
     * 
     * @param ProcessPaymentRequest $request
     * @return JsonResponse
     */
    public function processPayment(ProcessPaymentRequest $request)
    {
        try {
            // Ambil customer dari user yang login
            $user = $request->user();
            $customer = $user->customer;

            // Get order with ownership check
            $order = Order::where('code', $request->order_code)
                ->where('customer_id', $customer->id) // Ownership check
                ->with('items')
                ->first();

            if (!$order) {
                return ApiResponse::notFound('Order tidak ditemukan atau bukan milik Anda');
            }

            // Validate order status
            if (!$order->isPending() || !$order->isUnpaid()) {
                return ApiResponse::error(
                    'Order tidak dapat diproses. Status: ' . $order->status . ', Payment: ' . $order->payment_status,
                    400
                );
            }

            // Check if order expired (hanya jika expired_at sudah di-set)
            if ($order->expired_at && $order->isExpired()) {
                $order->update(['status' => 'cancelled', 'payment_status' => 'expired']);
                return ApiResponse::error('Order sudah kadaluarsa', 400);
            }

            // Get payment method
            $paymentMethod = PaymentMethod::where('code', $request->payment_method_code)
                ->active()
                ->firstOrFail();

            // Validate amount
            if (!$paymentMethod->isValidAmount($order->grand_total)) {
                return ApiResponse::error(
                    "Jumlah pembayaran tidak valid untuk metode {$paymentMethod->method_name}. " .
                        "Min: {$paymentMethod->min_amount}, Max: " . ($paymentMethod->max_amount ?? 'unlimited'),
                    400
                );
            }

            // Check if already has payment method (re-process case)
            if ($order->payment_method_id && $order->midtrans_order_id) {
                return ApiResponse::error(
                    'Order sudah memiliki metode pembayaran. Gunakan endpoint cek status.',
                    400
                );
            }

            // === APPLY VOUCHER IF PROVIDED ===
            $customerVoucher = null;
            if ($request->voucher_id) {
                // Check voucher is valid and available
                $voucher = Voucher::available()->find($request->voucher_id);
                if (!$voucher) {
                    return ApiResponse::error('Voucher tidak valid atau sudah expired', 400);
                }

                // Check customer owns this voucher and hasn't used it
                $customerVoucher = CustomerVoucher::where('customer_id', $customer->id)
                    ->where('voucher_id', $voucher->id)
                    ->where('is_used', false)
                    ->first();

                if (!$customerVoucher) {
                    return ApiResponse::error('Voucher tidak ditemukan atau sudah digunakan', 400);
                }

                // Check order doesn't already have a voucher
                if ($order->voucher_id) {
                    return ApiResponse::error('Order sudah memiliki voucher', 400);
                }

                // Calculate new totals with voucher
                $discount = (float) $voucher->discount_value;
                $newGrandTotal = ($order->sub_total + $order->shipping_fee + $order->admin_fee) - $discount;
                if ($newGrandTotal < 0) $newGrandTotal = 0;

                // Update order with voucher
                $order->update([
                    'voucher_id' => $voucher->id,
                    'discount' => $discount,
                    'grand_total' => $newGrandTotal,
                ]);

                // Refresh order to get updated values
                $order->refresh();

                Log::info("Voucher applied to order {$order->code}", [
                    'voucher_id' => $voucher->id,
                    'discount' => $discount,
                    'new_grand_total' => $newGrandTotal,
                ]);
            }

            // Create payment via Midtrans Core API
            $result = $this->midtransService->createCoreTransaction($order, $paymentMethod->code);

            if (!$result->success) {
                Log::error('Midtrans Payment Error: ' . $result->message);
                return ApiResponse::error(
                    'Gagal membuat pembayaran: ' . $result->message,
                    500
                );
            }

            // Update order with payment details
            $updateData = [
                'payment_method_id' => $paymentMethod->id,
                'midtrans_transaction_id' => $result->transaction_id,
                'midtrans_order_id' => $result->order_id,
                'payment_instructions' => $result->payment_instructions,
                'payment_status' => 'pending',
                'expired_at' => now()->addHours(1), // Set expire time saat payment process
            ];

            // Update shipping address jika dikirim
            if ($request->shipping_address) {
                $updateData['shipping_address'] = $request->shipping_address;
            }
            if ($request->shipping_recipient_name) {
                $updateData['shipping_recipient_name'] = $request->shipping_recipient_name;
            }
            if ($request->shipping_recipient_phone) {
                $updateData['shipping_recipient_phone'] = $request->shipping_recipient_phone;
            }

            $order->update($updateData);

            // Mark voucher as used (after successful payment creation)
            if ($customerVoucher) {
                $customerVoucher->update([
                    'is_used' => true,
                    'used_at' => now(),
                ]);
                Log::info("Voucher marked as used", ['customer_voucher_id' => $customerVoucher->id]);
            }


            // Kirim notifikasi pending payment ke customer
            $this->sendPaymentPendingNotification($order);

            // Prepare response
            $response = [
                'order_code' => $order->code,
                'payment_method' => [
                    'code' => $paymentMethod->code,
                    'name' => $paymentMethod->method_name,
                    'category' => $paymentMethod->payment_type,
                ],
                'payment_status' => $order->payment_status,
                'grand_total' => $order->grand_total,
                'created_at' => $order->created_at?->toIso8601String(),
                'expired_at' => $order->expired_at?->toIso8601String(),
            ];

            // Add payment-specific instructions
            $instructions = $result->payment_instructions;

            if (in_array($paymentMethod->code, ['va_bca', 'va_bni', 'va_bri', 'va_permata'])) {
                // Virtual Account
                $response['va_number'] = $instructions['va_number'] ?? $instructions['payment_code'] ?? null;
                $response['bank'] = $instructions['bank'] ?? null;
            } elseif ($paymentMethod->code === 'va_mandiri') {
                // Mandiri Bill Payment
                $response['payment_code'] = $instructions['payment_code'] ?? null;
                $response['company_code'] = $instructions['company_code'] ?? null;
            } elseif ($paymentMethod->code === 'gopay') {
                // GoPay
                $response['deeplink'] = $instructions['deeplink'] ?? null;
                $response['qr_code_url'] = $instructions['qr_code_url'] ?? null;
            } elseif ($paymentMethod->code === 'shopeepay') {
                // ShopeePay
                $response['deeplink'] = $instructions['deeplink'] ?? null;
            } elseif ($paymentMethod->code === 'qris') {
                // QRIS
                $response['qr_code_url'] = $instructions['qr_code_url'] ?? null;
            }

            return ApiResponse::success(
                $response,
                'Pembayaran berhasil dibuat. Silakan selesaikan pembayaran sesuai instruksi.',
                201
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound('Order atau metode pembayaran tidak ditemukan');
        } catch (\Exception $e) {
            Log::error('Process Payment Error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return ApiResponse::serverError('Gagal memproses pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Check payment status manually from Midtrans
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function checkPaymentStatus(Request $request)
    {
        $request->validate([
            'order_code' => 'required|string|exists:orders,code',
        ]);

        try {
            // Ambil customer dari user yang login
            $user = $request->user();
            $customer = $user->customer;

            $order = Order::where('code', $request->order_code)
                ->where('customer_id', $customer->id) // Ownership check
                ->with('paymentMethod')
                ->first();

            if (!$order) {
                return ApiResponse::notFound('Order tidak ditemukan atau bukan milik Anda');
            }

            // Check if order is expired
            if ($order->isExpired() && $order->payment_status !== 'paid') {
                // Restore voucher sebelum update status
                $this->restoreVoucherIfUsed($order);

                $order->update([
                    'status' => 'cancelled',
                    'payment_status' => 'expired'
                ]);

                return ApiResponse::success([
                    'order_code' => $order->code,
                    'status' => 'cancelled',
                    'payment_status' => 'expired',
                    'expired_at' => $order->expired_at?->toIso8601String(),
                    'message' => 'Order sudah kadaluarsa',
                ], 'Order sudah kadaluarsa');
            }

            if (!$order->midtrans_order_id) {
                return ApiResponse::error('Order belum memiliki pembayaran', 400);
            }

            // Get status from Midtrans
            $result = $this->midtransService->getTransactionStatus($order->midtrans_order_id);

            if (!$result->success) {
                return ApiResponse::error('Gagal mengecek status: ' . $result->message, 500);
            }

            $midtransData = $result->data;

            // Determine payment status
            $paymentStatus = $this->mapMidtransStatus(
                $midtransData->transaction_status,
                $midtransData->fraud_status ?? null
            );

            // Update order if status changed
            if ($order->payment_status !== $paymentStatus) {
                $updateData = ['payment_status' => $paymentStatus];

                // Set paid_at if payment success
                if ($paymentStatus === 'paid' && !$order->paid_at) {
                    $updateData['paid_at'] = now();
                    $updateData['status'] = 'confirmed'; // Auto confirm after payment

                    // Give points to customer (1 point per Rp 1.000)
                    $this->awardPointsToCustomer($order);
                }

                // Handle expired or failed from Midtrans - restore voucher
                if (in_array($paymentStatus, ['expired', 'failed'])) {
                    $updateData['status'] = 'cancelled';

                    // Restore voucher jika ada
                    $this->restoreVoucherIfUsed($order);
                }

                $order->update($updateData);

                Log::info("Order {$order->code} status updated: {$paymentStatus}");
            }

            return ApiResponse::success([
                'order_code' => $order->code,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'expired_at' => $order->expired_at?->toIso8601String(),
                'payment_method' => $order->paymentMethod ? [
                    'name' => $order->paymentMethod->method_name,
                    'code' => $order->paymentMethod->code,
                ] : null,
                'grand_total' => $order->grand_total,
                'paid_at' => $order->paid_at?->toIso8601String(),
                'midtrans_data' => [
                    'transaction_id' => $midtransData->transaction_id,
                    'transaction_status' => $midtransData->transaction_status,
                    'transaction_time' => $midtransData->transaction_time,
                ],
            ], 'Status pembayaran berhasil diperbarui');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return ApiResponse::notFound('Order tidak ditemukan');
        } catch (\Exception $e) {
            Log::error('Check Payment Status Error: ' . $e->getMessage());
            return ApiResponse::serverError('Gagal mengecek status pembayaran');
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
     * Kirim notifikasi pending payment ke customer
     */
    private function sendPaymentPendingNotification(Order $order): void
    {
        try {
            $order->load('customer.user');
            $customer = $order->customer;
            if (!$customer || !$customer->user_id) return;

            $user = $customer->user;
            if (!$user || !$user->email) return;

            $title = 'Menunggu Pembayaran 💳';
            $body = "Mohon selesaikan pembayaran untuk Invoice #{$order->code}";

            // Simpan ke database
            Notification::create([
                'title' => $title,
                'body' => $body,
                'from_user_id' => null,
                'to_user_id' => $customer->user_id,
            ]);

            // Kirim email
            Mail::to($user->email)->send(new NotificationMail($title, $body));

            Log::info('Payment pending notification sent', [
                'order_code' => $order->code,
                'user_id' => $customer->user_id,
                'email' => $user->email,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send payment pending notification', [
                'error' => $e->getMessage(),
                'order_code' => $order->code,
            ]);
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
