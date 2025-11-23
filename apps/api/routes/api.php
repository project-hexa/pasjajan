<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Dashboard Reports
Route::get('/dashboard/report-sales', [DashboardController::class, 'reportSales'])->name('dashboard.report.sales');

// Branch Management Routes
Route::get('/branches', [DashboardController::class, 'listBranches'])->name('branches.index');
Route::post('/branches', [DashboardController::class, 'storeBranch'])->name('branches.store');
Route::get('/branches/{id}', [DashboardController::class, 'showBranch'])->name('branches.show');
Route::put('/branches/{id}', [DashboardController::class, 'updateBranch'])->name('branches.update');
Route::patch('/branches/{id}/deactivate', [DashboardController::class, 'deactivateBranch'])->name('branches.deactivate');
Route::patch('/branches/{id}/activate', [DashboardController::class, 'activateBranch'])->name('branches.activate');
