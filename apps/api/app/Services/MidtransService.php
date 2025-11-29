<?php

namespace App\Services;

use Midtrans\Config;
use Midtrans\CoreApi;
use Midtrans\Notification;
use Midtrans\Transaction as MidtransTransaction;
use Illuminate\Support\Facades\Log;

class MidtransService
{
    public function __construct()
    {
        // Set Midtrans configuration
        Config::$serverKey = config('midtrans.server_key');
        Config::$clientKey = config('midtrans.client_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized = config('midtrans.is_sanitized');
        Config::$is3ds = config('midtrans.is_3ds');
    }

    /**
     * Create transaction with specific payment method using Core API
     * 
     * @param \App\Models\Order $order
     * @param string $paymentMethod (va_bca, va_bni, gopay, qris, shopeepay, etc)
     * @return object
     */
    public function createCoreTransaction($order, string $paymentMethod)
    {
        try {
            $params = $this->buildCoreTransactionParams($order, $paymentMethod);

            // Log parameters for debugging
            Log::info('Midtrans Request Params', [
                'order_code' => $order->code,
                'payment_method' => $paymentMethod,
                'params' => $params,
            ]);

            // Call Midtrans Core API
            $response = CoreApi::charge($params);

            // Log response for debugging
            Log::info('Midtrans Response', [
                'order_code' => $order->code,
                'response' => $response,
            ]);

            // Extract payment instructions based on payment type
            $paymentInstructions = $this->extractPaymentInstructions($response, $paymentMethod);

            return (object) [
                'success' => true,
                'transaction_id' => $response->transaction_id,
                'order_id' => $response->order_id,
                'payment_type' => $response->payment_type,
                'transaction_status' => $response->transaction_status,
                'payment_instructions' => $paymentInstructions,
                'raw_response' => $response,
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans Create Transaction Error', [
                'order_code' => $order->code ?? 'unknown',
                'payment_method' => $paymentMethod,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return (object) [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Build Core API transaction parameters
     * 
     * @param \App\Models\Order $order
     * @param string $paymentMethod
     * @return array
     */
    private function buildCoreTransactionParams($order, string $paymentMethod): array
    {
        $baseParams = [
            'transaction_details' => [
                'order_id' => $order->code, // Use order code as order_id
                'gross_amount' => (int) $order->grand_total,
            ],
            'customer_details' => [
                'first_name' => $order->customer_name ?? 'Customer',
                'email' => $order->customer_email,
                'phone' => $order->customer_phone ?? $order->shipping_recipient_phone,
                'billing_address' => [
                    'first_name' => $order->customer_name ?? 'Customer',
                    'phone' => $order->customer_phone ?? $order->shipping_recipient_phone,
                    'address' => $order->shipping_address,
                ],
                'shipping_address' => [
                    'first_name' => $order->shipping_recipient_name ?? $order->customer_name ?? 'Customer',
                    'phone' => $order->shipping_recipient_phone,
                    'address' => $order->shipping_address,
                ],
            ],
            'item_details' => $this->buildItemDetails($order),
        ];

        // Add payment-specific parameters
        switch ($paymentMethod) {
            case 'va_bca':
                $baseParams['payment_type'] = 'bank_transfer';
                $baseParams['bank_transfer'] = ['bank' => 'bca'];
                break;

            case 'va_bni':
                $baseParams['payment_type'] = 'bank_transfer';
                $baseParams['bank_transfer'] = ['bank' => 'bni'];
                break;

            case 'va_bri':
                $baseParams['payment_type'] = 'bank_transfer';
                $baseParams['bank_transfer'] = ['bank' => 'bri'];
                break;

            case 'va_mandiri':
                $baseParams['payment_type'] = 'echannel';
                $baseParams['echannel'] = [
                    'bill_info1' => 'Payment For:',
                    'bill_info2' => 'Order ' . $order->order_id,
                ];
                break;

            case 'va_permata':
                $baseParams['payment_type'] = 'permata';
                break;

            case 'gopay':
                $baseParams['payment_type'] = 'gopay';
                $baseParams['gopay'] = [
                    'enable_callback' => true,
                    'callback_url' => config('app.frontend_url') . '/payment/gopay/callback',
                ];
                break;

            case 'shopeepay':
                $baseParams['payment_type'] = 'shopeepay';
                $baseParams['shopeepay'] = [
                    'callback_url' => config('app.frontend_url') . '/payment/shopeepay/callback',
                ];
                break;

            case 'qris':
                $baseParams['payment_type'] = 'qris';
                $baseParams['qris'] = [
                    'acquirer' => 'gopay', // atau 'airpay'
                ];
                break;

            default:
                throw new \Exception("Unsupported payment method: {$paymentMethod}");
        }

        return $baseParams;
    }

    /**
     * Extract payment instructions from Midtrans response
     * 
     * @param object $response
     * @param string $paymentMethod
     * @return array
     */
    private function extractPaymentInstructions($response, string $paymentMethod): array
    {
        $instructions = [
            'payment_method' => $paymentMethod,
            'transaction_id' => $response->transaction_id,
            'order_id' => $response->order_id,
            'gross_amount' => $response->gross_amount,
            'transaction_status' => $response->transaction_status,
            'transaction_time' => $response->transaction_time,
        ];

        // Extract specific payment instructions based on type
        if (in_array($paymentMethod, ['va_bca', 'va_bni', 'va_bri', 'va_permata'])) {
            // Virtual Account
            if (isset($response->va_numbers) && count($response->va_numbers) > 0) {
                $instructions['va_number'] = $response->va_numbers[0]->va_number;
                $instructions['bank'] = $response->va_numbers[0]->bank;
            } elseif (isset($response->permata_va_number)) {
                $instructions['va_number'] = $response->permata_va_number;
                $instructions['bank'] = 'permata';
            }
            $instructions['payment_code'] = $instructions['va_number'] ?? null;
        } elseif ($paymentMethod === 'va_mandiri') {
            // Mandiri Bill Payment (E-Channel)
            $instructions['payment_code'] = $response->bill_key ?? null;
            $instructions['company_code'] = $response->biller_code ?? null;
            $instructions['bank'] = 'mandiri';
        } elseif ($paymentMethod === 'gopay') {
            // GoPay
            $instructions['deeplink'] = $response->actions[0]->url ?? null;
            $instructions['qr_code_url'] = $response->actions[1]->url ?? null;
        } elseif ($paymentMethod === 'shopeepay') {
            // ShopeePay
            $instructions['deeplink'] = $response->actions[0]->url ?? null;
        } elseif ($paymentMethod === 'qris') {
            // QRIS
            $instructions['qr_code_url'] = $response->actions[0]->url ?? null;
            $instructions['acquirer'] = $response->acquirer ?? 'gopay';
        }

        return $instructions;
    }

    /**
     * Build item details for Midtrans
     * 
     * @param \App\Models\Order $order
     * @return array
     */
    private function buildItemDetails($order): array
    {
        $items = [];

        // Add product items
        foreach ($order->items as $item) {
            // Fetch product name from Product model since OrderItem doesn't store it
            $product = \App\Models\Product::find($item->product_id);
            $productName = $product ? $product->name : "Product #{$item->product_id}";

            $items[] = [
                'id' => (string) $item->product_id,
                'price' => (int) $item->price,
                'quantity' => $item->quantity,
                'name' => substr($productName, 0, 50), // Midtrans limit 50 chars
            ];
        }

        // Add discount as negative item
        if ($order->discount > 0) {
            $items[] = [
                'id' => 'DISCOUNT',
                'price' => -1 * (int) $order->discount,
                'quantity' => 1,
                'name' => 'Discount',
            ];
        }

        // Add shipping cost
        if ($order->shipping_fee > 0) {
            $items[] = [
                'id' => 'SHIPPING',
                'price' => (int) $order->shipping_fee,
                'quantity' => 1,
                'name' => 'Shipping Cost',
            ];
        }

        // Add admin fee
        if ($order->admin_fee > 0) {
            $items[] = [
                'id' => 'ADMIN_FEE',
                'price' => (int) $order->admin_fee,
                'quantity' => 1,
                'name' => 'Admin Fee',
            ];
        }

        return $items;
    }

    /**
     * Get transaction status from Midtrans
     * 
     * @param string $orderId
     * @return object
     */
    public function getTransactionStatus(string $orderId)
    {
        try {
            $status = MidtransTransaction::status($orderId);

            return (object) [
                'success' => true,
                'data' => $status,
            ];
        } catch (\Exception $e) {
            return (object) [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Handle Midtrans notification/webhook
     * 
     * @param array $notificationData
     * @return object
     */
    public function handleNotification(array $notificationData)
    {
        try {
            $notification = new Notification($notificationData);

            // Verify signature (Midtrans will throw exception if invalid)
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

            // Determine payment status
            $paymentStatus = $this->determinePaymentStatus(
                $notification->transaction_status,
                $notification->fraud_status ?? null
            );

            return (object) [
                'success' => true,
                'data' => $verifiedData,
                'payment_status' => $paymentStatus,
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans Notification Error: ' . $e->getMessage());

            return (object) [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Determine payment status based on Midtrans response
     * 
     * @param string $transactionStatus
     * @param string|null $fraudStatus
     * @return string
     */
    private function determinePaymentStatus(string $transactionStatus, ?string $fraudStatus): string
    {
        if ($transactionStatus == 'capture') {
            return ($fraudStatus == 'accept') ? 'capture' : 'pending';
        } elseif ($transactionStatus == 'settlement') {
            return 'settlement';
        } elseif (in_array($transactionStatus, ['cancel', 'deny', 'expire'])) {
            return $transactionStatus;
        } elseif ($transactionStatus == 'pending') {
            return 'pending';
        } else {
            return 'failure';
        }
    }

    /**
     * Cancel transaction
     * Uses Midtrans Transaction API to cancel pending transaction
     * 
     * @param string $orderId
     * @return object
     */
    public function cancelTransaction(string $orderId)
    {
        try {
            // Use Transaction class, not CoreApi
            $response = MidtransTransaction::cancel($orderId);

            return (object) [
                'success' => true,
                'data' => $response,
                'message' => 'Transaction successfully cancelled',
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans Cancel Error: ' . $e->getMessage());

            return (object) [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Expire transaction
     * Uses Midtrans Transaction API to expire pending transaction
     * 
     * @param string $orderId
     * @return object
     */
    public function expireTransaction(string $orderId)
    {
        try {
            // Use Transaction class, not CoreApi
            $response = MidtransTransaction::expire($orderId);

            return (object) [
                'success' => true,
                'data' => $response,
                'message' => 'Transaction successfully expired',
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans Expire Error: ' . $e->getMessage());

            return (object) [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Refund transaction (for settled/capture transactions)
     * 
     * @param string $orderId
     * @param int|null $amount - null for full refund
     * @param string|null $reason
     * @return object
     */
    public function refundTransaction(string $orderId, ?int $amount = null, ?string $reason = null)
    {
        try {
            $params = [];

            if ($amount !== null) {
                $params['refund_amount'] = $amount;
            }

            if ($reason !== null) {
                $params['reason'] = $reason;
            }

            $response = MidtransTransaction::refund($orderId, $params);

            return (object) [
                'success' => true,
                'data' => $response,
                'message' => 'Refund request successful',
            ];
        } catch (\Exception $e) {
            Log::error('Midtrans Refund Error: ' . $e->getMessage());

            return (object) [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get list of available payment methods
     * Only VA Banks, E-Wallets, and QRIS
     * 
     * @return array
     */
    public static function getAvailablePaymentMethods(): array
    {
        return [
            [
                'code' => 'va_bca',
                'name' => 'BCA Virtual Account',
                'category' => 'bank_transfer',
                'icon' => 'bca.png',
                'fee' => 4000,
            ],
            [
                'code' => 'va_bni',
                'name' => 'BNI Virtual Account',
                'category' => 'bank_transfer',
                'icon' => 'bni.png',
                'fee' => 4000,
            ],
            [
                'code' => 'va_bri',
                'name' => 'BRI Virtual Account',
                'category' => 'bank_transfer',
                'icon' => 'bri.png',
                'fee' => 4000,
            ],
            [
                'code' => 'va_mandiri',
                'name' => 'Mandiri Virtual Account',
                'category' => 'bank_transfer',
                'icon' => 'mandiri.png',
                'fee' => 4000,
            ],
            [
                'code' => 'va_permata',
                'name' => 'Permata Virtual Account',
                'category' => 'bank_transfer',
                'icon' => 'permata.png',
                'fee' => 4000,
            ],
            [
                'code' => 'gopay',
                'name' => 'GoPay',
                'category' => 'e_wallet',
                'icon' => 'gopay.png',
                'fee' => 2000,
            ],
            [
                'code' => 'shopeepay',
                'name' => 'ShopeePay',
                'category' => 'e_wallet',
                'icon' => 'shopeepay.png',
                'fee' => 2000,
            ],
            [
                'code' => 'qris',
                'name' => 'QRIS (Semua E-Wallet)',
                'category' => 'qris',
                'icon' => 'qris.png',
                'fee' => 0,
            ],
        ];
    }
}
