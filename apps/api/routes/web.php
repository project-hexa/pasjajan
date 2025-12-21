<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return;
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Route dashboard lainnya...
});

Route::get('/_debug/mail', function () {
    return response()->json([
        'default_mailer' => config('mail.default'),
        'smtp_config' => config('mail.mailers.smtp'),
        'resend_config' => config('mail.mailers.resend'),
        'all_env' => [
        'MAIL_MAILER' => env('MAIL_MAILER'),
        'MAIL_HOST' => env('MAIL_HOST'),
        'MAIL_PORT' => env('MAIL_PORT'),
        'MAIL_ENCRYPTION' => env('MAIL_ENCRYPTION'),
        ],
    ]);
});
