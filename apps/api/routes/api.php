<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebhookController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Payment Methods
Route::get('/payment-methods', [PaymentController::class, 'getPaymentMethods']);

// Checkout & Create Transaction
Route::post('/checkout', [OrderController::class, 'checkout']);

// Process Payment (setelah pilih metode)
Route::post('/payment/process', [PaymentController::class, 'processPayment']);

// Check Order & Payment Status
Route::get('/orders/{code}', [OrderController::class, 'getOrder']);

// Get Order List (untuk customer)
Route::get('/orders', [OrderController::class, 'getOrders']);

// Cancel Order (jika masih pending)
Route::post('/orders/{code}/cancel', [OrderController::class, 'cancelOrder']);

// Check payment status manually
Route::post('/payment/check-status', [PaymentController::class, 'checkPaymentStatus']);


// ============= STAFF ROUTES =============
// Untuk operasional staff - butuh auth & role checking
Route::prefix('staff')->group(function () {
    // Get recent orders for staff monitoring
    Route::get('/orders/recent', [OrderController::class, 'getRecentOrders']);

    // Get order detail for staff
    Route::get('/orders/{code}', [OrderController::class, 'getOrder']);
});


// ============= ADMIN ROUTES =============
// Untuk monitoring admin - butuh auth & admin role
Route::prefix('admin')->group(function () {
    // Dashboard orders
    Route::get('/orders', [OrderController::class, 'getOrdersForAdmin']);

    // Order statistics
    Route::get('/orders/stats', [OrderController::class, 'getStatistics']);
});



// ============= WEBHOOK ROUTES =============
// Midtrans notification webhook (no auth, verified by signature)
Route::post('/payment/webhook', [WebhookController::class, 'handleMidtransNotification']);

// Manual check status from Midtrans (untuk sync ulang jika ada masalah)
Route::post('/payment/check-status', [PaymentController::class, 'checkPaymentStatus']);

if (config('app.env') !== 'production') {
    Route::post('/payment/webhook/test', [WebhookController::class, 'testWebhook']);
}
