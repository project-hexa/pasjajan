<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Notification;
use App\Services\MidtransService;
use App\Events\NotificationSent;
use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    /**
     * Handle Midtrans notification webhook
     * This endpoint will be called by Midtrans when payment status changes
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function handleMidtransNotification(Request $request)
    {
        try {
            // Log incoming notification for debugging
            Log::info('Midtrans Webhook Received', [
                'payload' => $request->all(),
                'ip' => $request->ip(),
            ]);

            // Midtrans Notification class needs to read from php://input
            // So we don't pass $request->all(), let it read directly
            $notification = new \Midtrans\Notification();

            // Get verified data from notification object
            $verifiedData = [
                'transaction_id' => $notification->transaction_id,
                'order_id' => $notification->order_id,
                'gross_amount' => $notification->gross_amount,
                'payment_type' => $notification->payment_type,
                'transaction_time' => $notification->transaction_time,
                'transaction_status' => $notification->transaction_status,
                'fraud_status' => $notification->fraud_status ?? null,
                'status_code' => $notification->status_code,
            ];

            $midtransStatus = $notification->transaction_status;
            $fraudStatus = $notification->fraud_status ?? null;

            // Map Midtrans status to our payment_status
            $paymentStatus = $this->mapMidtransStatus($midtransStatus, $fraudStatus);

            // Find order by midtrans_order_id or code
            $order = Order::where('midtrans_order_id', $verifiedData['order_id'])
                ->orWhere('code', $verifiedData['order_id'])
                ->first();

            if (!$order) {
                Log::warning('Order not found for webhook', [
                    'order_id' => $verifiedData['order_id'],
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Order not found',
                ], 404);
            }

            // Log current status
            Log::info('Processing webhook for order', [
                'order_code' => $order->code,
                'current_status' => $order->status,
                'current_payment_status' => $order->payment_status,
                'new_payment_status' => $paymentStatus,
            ]);

            // Update order
            $updateData = [
                'payment_status' => $paymentStatus,
                'midtrans_transaction_id' => $verifiedData['transaction_id'],
            ];

            if ($paymentStatus === 'paid') {
                // Payment successful
                if (!$order->paid_at) {
                    $updateData['paid_at'] = now();
                }

                // Auto-confirm order after payment
                if ($order->status === 'pending') {
                    $updateData['status'] = 'confirmed';
                }

                Log::info('Payment successful', [
                    'order_code' => $order->code,
                    'amount' => $order->grand_total,
                    'payment_method_id' => $order->payment_method_id,
                ]);

                // Kirim notifikasi ke customer dan staff
                $order->load(['paymentMethod', 'items', 'customer']);
                $this->sendPaymentSuccessNotification($order);
                $this->sendPaymentSuccessNotificationToStaff($order);
            } elseif (in_array($paymentStatus, ['failed', 'expired'])) {
                // Payment failed or expired
                Log::warning('Payment failed or expired', [
                    'order_code' => $order->code,
                    'status' => $paymentStatus,
                ]);

                // Kirim notifikasi ke customer
                $order->load('customer');
                $this->sendPaymentExpiredNotification($order);
            }

            // Update order
            $order->update($updateData);

            // Log final status
            Log::info('Webhook processed successfully', [
                'order_code' => $order->code,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
            ]);

            // Return success response to Midtrans
            return response()->json([
                'status' => 'success',
                'message' => 'Notification processed successfully',
            ], 200);
        } catch (\Exception $e) {
            Log::error('Webhook Processing Error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'payload' => $request->all(),
            ]);

            // Still return 200 to Midtrans to prevent retry
            // But log the error for investigation
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
            ], 200);
        }
    }

    /**
     * Test webhook endpoint (for development/testing only)
     * DO NOT use in production
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function testWebhook(Request $request)
    {
        if (config('app.env') === 'production') {
            return ApiResponse::forbidden('Endpoint not available in production');
        }

        try {
            $request->validate([
                'order_code' => 'required|string',
                'transaction_status' => 'required|string|in:pending,settlement,capture,deny,cancel,expire,failure',
            ]);

            $order = Order::where('code', $request->order_code)
                ->orWhere('midtrans_order_id', $request->order_code)
                ->first();

            if (!$order) {
                return ApiResponse::notFound('Order not found');
            }

            // Map status
            $paymentStatus = $this->mapMidtransStatus(
                $request->transaction_status,
                $request->fraud_status ?? null
            );

            // Update order
            $updateData = ['payment_status' => $paymentStatus];

            if ($paymentStatus === 'paid' && !$order->paid_at) {
                $updateData['paid_at'] = now();
                if ($order->status === 'pending') {
                    $updateData['status'] = 'confirmed';
                }
            }

            $order->update($updateData);

            return ApiResponse::success([
                'order_code' => $order->code,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'paid_at' => $order->paid_at?->toIso8601String(),
            ], 'Test webhook processed successfully');
        } catch (\Exception $e) {
            Log::error('Test Webhook Error: ' . $e->getMessage());
            return ApiResponse::serverError('Failed to process test webhook');
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
     * Kirim notifikasi payment success ke customer
     */
    private function sendPaymentSuccessNotification(Order $order): void
    {
        try {
            $customer = $order->customer;
            if (!$customer || !$customer->user_id) return;

            $notification = Notification::create([
                'title' => 'Pembayaran Berhasil! 🎉',
                'body' => 'Pembayaran sukses dikonfirmasi. Duduk manis ya, paketmu segera meluncur!',
                'from_user_id' => null,
                'to_user_id' => $customer->user_id,
            ]);

            broadcast(new NotificationSent($notification))->toOthers();

            Log::info('Payment success notification sent to customer', [
                'order_code' => $order->code,
                'user_id' => $customer->user_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send payment success notification', [
                'error' => $e->getMessage(),
                'order_code' => $order->code,
            ]);
        }
    }

    /**
     * Kirim notifikasi payment success ke staff/admin
     */
    private function sendPaymentSuccessNotificationToStaff(Order $order): void
    {
        try {
            // Ambil semua admin/staff
            $staffUsers = User::whereIn('role', ['Admin', 'Staff'])->get();

            $buyerName = $order->customer_name ?? 'Customer';
            $paymentMethod = $order->paymentMethod->method_name ?? 'Unknown';
            $itemCount = $order->items->count();

            foreach ($staffUsers as $staff) {
                $notification = Notification::create([
                    'title' => "Pembayaran dari {$buyerName} 💰",
                    'body' => "Pembayaran berhasil, metode pembayaran {$paymentMethod}, {$itemCount} produk. Kode: {$order->code}",
                    'from_user_id' => null,
                    'to_user_id' => $staff->id,
                ]);

                broadcast(new NotificationSent($notification))->toOthers();
            }

            Log::info('Payment success notification sent to staff', [
                'order_code' => $order->code,
                'staff_count' => $staffUsers->count(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send staff notification', [
                'error' => $e->getMessage(),
                'order_code' => $order->code,
            ]);
        }
    }

    /**
     * Kirim notifikasi payment expired ke customer
     */
    private function sendPaymentExpiredNotification(Order $order): void
    {
        try {
            $customer = $order->customer;
            if (!$customer || !$customer->user_id) return;

            $notification = Notification::create([
                'title' => 'Pembayaran Kedaluwarsa ⏰',
                'body' => 'Batas waktu pembayaran untuk pesanan ini telah berakhir. Silahkan lakukan pemesanan ulang.',
                'from_user_id' => null,
                'to_user_id' => $customer->user_id,
            ]);

            broadcast(new NotificationSent($notification))->toOthers();

            Log::info('Payment expired notification sent to customer', [
                'order_code' => $order->code,
                'user_id' => $customer->user_id,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send payment expired notification', [
                'error' => $e->getMessage(),
                'order_code' => $order->code,
            ]);
        }
    }
}
