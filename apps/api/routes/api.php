<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\reportSalesController;


/*
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
*/

// Membungkus route yang berkaitan dengan autentifikasi user ke route group yang menjalankan AuthController
Route::controller(AuthController::class)->group(function () {
	Route::post('/auth/login', 'loginPost');
	Route::post('/auth/register', 'registerPost');
	Route::post('/auth/forgot-password', 'forgotPassword');
	Route::post('/auth/send-otp', 'sendOtp');
	Route::post('/auth/verify-otp', 'verifyOtp');

	// Membungkus route yang memerlukan akses dari user yang terautentifikasi ke dalam route group yang sudah diterapkan middleware dengan auth dari sanctum
	Route::middleware('auth:sanctum')->group(function () {
		Route::get('/auth/logout', 'logout');
	});
});

// Membungkus route yang berkaitan dengan control atau data user ke route group yang menjalankan UserController
Route::controller(UserController::class)->group(function () {
	// Membungkus route yang memerlukan akses dari user yang terautentifikasi ke dalam route group yang sudah diterapkan middleware dengan auth dari sanctum
	Route::middleware('auth:sanctum')->group(function () {
		Route::get('/user/{username}/profile', 'getProfile');
		Route::post('/user/{username}/change-profile', 'changeProfile');
		Route::post('/user/{username}/add-address', 'createAddress');
		Route::post('/user/{username}/change-address/{addressId}', 'changeAddress');
		Route::post('/user/{username}/change-password', 'changePassword');
	});
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
});
