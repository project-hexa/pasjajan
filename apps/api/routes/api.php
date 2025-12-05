<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DeliveryController;

/*
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
*/

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

// Membungkus route yang berkaitan dengan autentifikasi user ke route group yang menjalankan AuthController
Route::controller(AuthController::class)->group(function () {
	Route::post('/auth/login', 'loginPost');
	Route::post('/auth/register', 'registerPost');
	Route::post('/auth/login/google', 'loginViaGoogle');
	Route::post('/auth/forgot-password', 'forgotPassword');
	Route::post('/auth/send-otp', 'sendOtp');
	Route::post('/auth/verify-otp', 'verifyOtp');

	// Membungkus route yang memerlukan akses dari user yang terautentifikasi ke dalam route group yang sudah diterapkan middleware dengan auth dari sanctum
	Route::middleware('auth:sanctum')->group(function() {
		Route::get('/auth/logout', 'logout');
	});
});

// Membungkus route yang berkaitan dengan control atau data user ke route group yang menjalankan UserController
Route::controller(UserController::class)->group(function () {
	// Membungkus route yang memerlukan akses dari user yang terautentifikasi ke dalam route group yang sudah diterapkan middleware dengan auth dari sanctum
	Route::middleware('auth:sanctum')->group(function () {
		Route::get('/user/profile', 'getProfile');
		Route::post('/user/change-profile', 'changeProfile');
		Route::post('/user/add-address', 'createAddress');
		Route::post('/user/change-address/{addressId}', 'changeAddress');
		Route::post('/user/change-password', 'changePassword');
		Route::get('/user/total-point', 'getPoint');
		Route::get('/user/order-history', 'getOrderHistory');
	});
});

// Membungkus route yang berkaitan dengan layanan pengiriman (tracking & review) ke route group yang menjalankan DeliveryController
Route::middleware('auth:sanctum')->group(function () {

    Route::controller(DeliveryController::class)->group(function () {
        // Get Status Pengiriman
        Route::get('/delivery/{order_id}/tracking', 'getTracking');

        // Kirim Ulasan
        Route::post('/delivery/{order_id}/review', 'submitReview');
    });

});
