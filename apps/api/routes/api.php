<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::get('/dashboard/report-sales', [DashboardController::class, 'reportSales']);


// Route::middleware(['auth:sanctum', 'admin'])->group(function () {
//     Route::get('/dashboard/report-sales', [DashboardController::class, 'reportSales']);
// });
