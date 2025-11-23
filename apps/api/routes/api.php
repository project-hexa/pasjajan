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

    // Branch Management
    Route::get('/branches', [BranchController::class, 'index'])->name('branches.index');
    Route::post('/branches', [BranchController::class, 'store'])->name('branches.store');
    Route::get('/branches/{id}', [BranchController::class, 'show'])->name('branches.show');
    Route::put('/branches/{id}', [BranchController::class, 'update'])->name('branches.update');
    Route::patch('/branches/{id}', [BranchController::class, 'update'])->name('branches.update.patch');
    Route::patch('/branches/{id}/deactivate', [BranchController::class, 'deactivate'])->name('branches.deactivate');
    Route::patch('/branches/{id}/activate', [BranchController::class, 'activate'])->name('branches.activate');
});
