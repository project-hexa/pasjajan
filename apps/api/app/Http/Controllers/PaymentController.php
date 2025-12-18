<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessPaymentRequest;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Notification;
use App\Services\MidtransService;
use App\Events\NotificationSent;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
            $order->update([
                'payment_method_id' => $paymentMethod->id,
                'midtrans_transaction_id' => $result->transaction_id,
                'midtrans_order_id' => $result->order_id,
                'payment_instructions' => $result->payment_instructions,
                'payment_status' => 'pending',
                'expired_at' => now()->addHours(1), // Set expire time saat payment process
            ]);

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
                }

                // Handle expired from Midtrans
                if ($paymentStatus === 'expired') {
                    $updateData['status'] = 'cancelled';
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
            $order->load('customer');
            $customer = $order->customer;
            if (!$customer || !$customer->user_id) return;

            $notification = Notification::create([
                'title' => 'Menunggu Pembayaran 💳',
                'body' => "Mohon selesaikan pembayaran untuk Invoice #{$order->code}",
                'from_user_id' => null,
                'to_user_id' => $customer->user_id,
            ]);

            broadcast(new NotificationSent($notification))->toOthers();

            Log::info('Payment pending notification sent', [
                'order_code' => $order->code,
                'user_id' => $customer->user_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send payment pending notification', [
                'error' => $e->getMessage(),
                'order_code' => $order->code,
            ]);
        }
    }
}
