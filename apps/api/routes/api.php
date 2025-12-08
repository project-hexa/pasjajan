<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\LogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\reportSalesController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PromoController;

use App\Http\Controllers\Product\StoreController;
use App\Http\Controllers\Product\ProductController;
use App\Http\Controllers\Product\ProductCategoryController;
use App\Http\Controllers\Product\CartController;
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
	Route::post('/auth/login/google', 'loginViaGoogle');
	Route::post('/auth/send-otp', 'sendOtp');
	Route::post('/auth/verify-otp', 'verifyOtp');

	// Membungkus route yang memerlukan verifikasi otp ke dalam route group yang sudah diterapkan middleware EnsureOtpIsVerified
	Route::middleware(EnsureOtpIsVerified::class)->group(function () {
		Route::post('/auth/register', 'registerPost');
		Route::post('/auth/forgot-password', 'forgotPassword');
	});

	// Membungkus route yang memerlukan akses dari user yang terautentifikasi ke dalam route group yang sudah diterapkan middleware dengan auth dari sanctum
	Route::middleware('auth:sanctum')->group(function () {
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
		Route::get('/admin/users/{role}', 'index');
		Route::get('/admin/user/{id}', 'show');
		Route::post('/admin/add-user', 'store');
		Route::post('/admin/edit-user/{id}', 'update');
		Route::get('/admin/delete-user/{id}', 'destroy');
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




	Route::middleware(['auth:sanctum', 'admin'])->group(function () {
		Route::get('/reports/sales', [reportSalesController::class, 'reportSales'])->name('reports.sales');

		// Branch Management
		Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
		Route::post('/branches', [BranchController::class, 'store'])->name('branches.store');
		Route::get('/branches/{id}', [BranchController::class, 'show'])->name('branches.show');
		Route::put('/branches/{id}', [BranchController::class, 'update'])->name('branches.update');
		Route::patch('/branches/{id}', [BranchController::class, 'update'])->name('branches.update.patch');
		Route::patch('/branches/{id}/deactivate', [BranchController::class, 'deactivate'])->name('branches.deactivate');
		Route::patch('/branches/{id}/activate', [BranchController::class, 'activate'])->name('branches.activate');


		//Customer Management
		Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
		Route::get('/customers/analytics', [CustomerController::class, 'analytics'])->name('customers.analytics');
		Route::get('/customers/export', [CustomerController::class, 'exportCustomers'])->name('customers.export');
		Route::get('/customers/{id}', [CustomerController::class, 'show'])->name('customers.show');
		Route::get('/customers/{id}/purchases', [CustomerController::class, 'purchases'])->name('customers.purchases');

		//Sales Report
		Route::get('/sales/export', [\App\Http\Controllers\reportSalesController::class, 'exportSales'])->name('sales.export');

		// Activity Logs
		Route::get('/logs', [LogController::class, 'index'])->name('logs.index');

		// Notifications
		Route::get('/notifications/metrics', [NotificationController::class, 'metrics'])->name('notifications.metrics');
		Route::post('/notifications/send', [NotificationController::class, 'send'])->name('notifications.send');
		Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
		Route::get('/notifications/{id}', [NotificationController::class, 'show'])->name('notifications.show');
	});
});


// Route::middleware('auth:sanctum')->group(function () {
Route::controller(PromoController::class)->group(function () {
	Route::get('/promos', 'active');
	Route::get('/promos/{id}', 'show');

	// Endpoint Admin
	Route::get('/admin/promos', 'index');
	Route::post('/admin/promos', 'store');
	Route::put('/admin/promos/{id}', 'update');
	Route::delete('/admin/promos/{id}', 'destroy');
});
// });



// ================= PRODUCT ROUTES =================
//Stores
Route::get('/stores', [StoreController::class, 'index']);
Route::get('/stores/{id}', [StoreController::class, 'show']);

//Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Categories
Route::get('/categories', [ProductCategoryController::class, 'index']);
Route::get('/categories/{id}', [ProductCategoryController::class, 'show']);

//Cart
Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'index']);
    Route::post('/add', [CartController::class, 'add']);
    Route::patch('/{cartId}', [CartController::class, 'update']);
    Route::delete('/{cartId}', [CartController::class, 'remove']);
    Route::post('/clear', [CartController::class, 'clear']);
});