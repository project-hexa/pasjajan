<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Sale;

class DashboardController extends Controller
{
    public function reportSales(Request $request)
    {
        // Validasi parameter
        $request->validate([
            'period'    => 'nullable|in:weekly,monthly,yearly',
            'from'      => 'nullable|date',
            'to'        => 'nullable|date|after_or_equal:from',
            'branch_id' => 'nullable|integer|exists:branches,id',
        ]);

        $period = $request->input('period', 'weekly');


        [$from, $to] = match ($period) {
            'monthly' => [Carbon::now()->subMonths(12)->startOfMonth(), Carbon::now()->endOfDay()],
            'yearly'  => [Carbon::now()->subYears(5)->startOfYear(),  Carbon::now()->endOfDay()],
            default   => [Carbon::now()->subWeeks(12)->startOfWeek(),  Carbon::now()->endOfDay()],
        };


        if ($request->filled('from')) $from = Carbon::parse($request->input('from'))->startOfDay();
        if ($request->filled('to'))   $to   = Carbon::parse($request->input('to'))->endOfDay();


        $groupByExpr = match ($period) {
            'monthly' => "DATE_FORMAT(sale_date, '%Y-%m-01')",
            'yearly'  => "DATE_FORMAT(sale_date, '%Y-01-01')",
            default   => "STR_TO_DATE(CONCAT(YEARWEEK(sale_date, 3), ' Monday'), '%X%V %W')",
        };


        $base = Sale::query()
            ->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()]);

        if ($request->filled('branch_id')) {
            $base->where('branch_id', $request->integer('branch_id'));
        }

        $summary = (clone $base)
            ->selectRaw('
                SUM(total_price) as total_revenue,
                COUNT(id)        as total_transactions,
                ROUND(AVG(total_price), 0) as avg_tx_value
            ')
            ->first();


        $totalUnitSold = (clone $base)->sum('quantity_sold');


        $periodicSales = (clone $base)
            ->groupBy(DB::raw($groupByExpr))
            ->orderBy(DB::raw($groupByExpr))
            ->selectRaw("
                {$groupByExpr} as period,
                COUNT(id)      as transactions,
                SUM(total_price) as revenue,
                SUM(quantity_sold) as units
            ")
            ->get();

        $topProduct = (clone $base)
            ->join('products', 'products.id', '=', 'sales.product_id')
            ->selectRaw('
                products.id,
                products.product_name,
                SUM(sales.quantity_sold) as unit_sold,
                SUM(sales.total_price)   as revenue,
                COUNT(sales.id)          as trx_count
            ')
            ->groupBy('products.id', 'products.product_name')
            ->orderByDesc('revenue')
            ->limit(10)
            ->get();

        return response()->json([
            'period'              => $period,
            'dateRange'           => [
                'from' => $from->toDateString(),
                'to'   => $to->toDateString(),
            ],
            'filters'             => [
                'branch_id' => $request->input('branch_id'),
            ],
            'totalRevenue'        => (float) ($summary->total_revenue ?? 0),
            'totalTransactions'   => (int)   ($summary->total_transactions ?? 0),
            'avgTransactionValue' => (float) ($summary->avg_tx_value ?? 0),
            'totalUnitSold'       => (int)   $totalUnitSold,
            'periodicSales'       => $periodicSales,
            'topProduct'          => $topProduct,
        ]);
    }
}
