<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Membungkus route yang berkaitan dengan autentifikasi user ke route group yang menjalankan AuthController
Route::controller(AuthController::class)->group(function () {
	Route::post('/auth/login', 'loginPost');
	Route::post('/auth/register', 'registerPost');
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
		Route::get('/user/{username}/profile', 'getProfile');
		Route::post('/user/{username}/change-profile', 'changeProfile');
		Route::post('/user/{username}/add-address', 'createAddress');
		Route::post('/user/{username}/change-address/{addressId}', 'changeAddress');
		Route::post('/user/{username}/change-password', 'changePassword');
	});
});
