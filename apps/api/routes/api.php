<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\reportSalesController;
use App\Http\Controllers\BranchController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Sales Reports - Protected: Admin & Staff only
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/reports/sales', [reportSalesController::class, 'reportSales'])->name('reports.sales');
});
