<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Sale;
use App\Models\Branch;

class DashboardController extends Controller
{
    public function reportSales(Request $request)
    {

        $request->validate([
            'period'    => 'nullable|in:daily,weekly,monthly,yearly',
            'from'      => 'nullable|date',
            'to'        => 'nullable|date|after_or_equal:from',
            'branch_id' => 'nullable|integer|exists:branches,id',
            'top_n'     => 'nullable|integer|min:1|max:50',
        ]);

        $period = $request->input('period', 'weekly');
        $topN = $request->input('top_n', 10);


        [$from, $to] = match ($period) {
            'daily'   => [Carbon::now()->subDays(30)->startOfDay(), Carbon::now()->endOfDay()],
            'monthly' => [Carbon::now()->subMonths(12)->startOfMonth(), Carbon::now()->endOfDay()],
            'yearly'  => [Carbon::now()->subYears(5)->startOfYear(),  Carbon::now()->endOfDay()],
            default   => [Carbon::now()->subWeeks(12)->startOfWeek(),  Carbon::now()->endOfDay()],
        };

        if ($request->filled('from')) $from = Carbon::parse($request->input('from'))->startOfDay();
        if ($request->filled('to'))   $to   = Carbon::parse($request->input('to'))->endOfDay();


        $groupByExpr = match ($period) {
            'daily'   => "DATE(sale_date)",
            'monthly' => "DATE_FORMAT(sale_date, '%Y-%m-01')",
            'yearly'  => "DATE_FORMAT(sale_date, '%Y-01-01')",
            default   => "STR_TO_DATE(CONCAT(YEARWEEK(sale_date, 3), ' Monday'), '%X%V %W')",
        };

        $base = Sale::query()
            ->whereBetween('sale_date', [$from->toDateString(), $to->toDateString()]);

        if ($request->filled('branch_id')) {
            $base->where('branch_id', $request->integer('branch_id'));
        }

        // Summary
        $summary = (clone $base)
            ->selectRaw('
                SUM(total_price) as total_revenue,
                COUNT(id)        as total_transactions,
                ROUND(AVG(total_price), 0) as avg_tx_value
            ')
            ->first();

        $totalUnitSold = (clone $base)->sum('quantity_sold');

        // Visualisasi Tren (Grafik)
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

        //  Top Product 
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
            ->orderByDesc('unit_sold')
            ->limit($topN)
            ->get();

        //Top Product Per Periode
        $topProductPerPeriod = $this->getTopProductPerPeriod(
            (clone $base),
            $groupByExpr,
            $topN
        );

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
            'topProductOverall'   => $topProduct,
            'topProductPerPeriod' => $topProductPerPeriod,
        ]);
    }


    private function getTopProductPerPeriod($baseQuery, $groupByExpr, $limit = 5)
    {
        $results = $baseQuery
            ->join('products', 'products.id', '=', 'sales.product_id')
            ->selectRaw("
                {$groupByExpr} as period,
                products.id as product_id,
                products.product_name,
                SUM(sales.quantity_sold) as unit_sold,
                SUM(sales.total_price) as revenue
            ")
            ->groupBy(DB::raw($groupByExpr), 'products.id', 'products.product_name')
            ->orderBy(DB::raw($groupByExpr))
            ->orderByDesc('unit_sold')
            ->get();

        return $results->groupBy('period')->map(function ($periodProducts) use ($limit) {
            return $periodProducts->take($limit)->values();
        });
    }


    public function storeBranch(Request $request)
    {
        $validated = $request->validate([
            'branch_name' => 'required|string|max:255',
            'address'     => 'required|string',
            'phone'       => 'required|string|max:20',
            'status'      => 'nullable|in:active,inactive',
        ]);


        if (!isset($validated['status'])) {
            $validated['status'] = 'active';
        }

        $branch = Branch::create($validated);

        return response()->json([
            'message' => 'Cabang berhasil ditambahkan',
            'data'    => $branch,
        ], 201);
    }


    public function updateBranch(Request $request, $id)
    {
        $branch = Branch::findOrFail($id);

        $validated = $request->validate([
            'branch_name' => 'sometimes|string|max:255',
            'address'     => 'sometimes|string',
            'phone'       => 'sometimes|string|max:20',
            'status'      => 'sometimes|in:active,inactive',
        ]);

        $branch->update($validated);

        return response()->json([
            'message' => 'Cabang berhasil diupdate',
            'data'    => $branch->fresh(),
        ]);
    }


    public function deactivateBranch($id)
    {
        $branch = Branch::findOrFail($id);


        $hasActiveSales = $branch->sales()
            ->where('sale_date', '>=', Carbon::now()->subDays(30))
            ->exists();

        if ($hasActiveSales) {
            return response()->json([
                'message' => 'Peringatan: Cabang masih memiliki transaksi dalam 30 hari terakhir',
                'warning' => true,
            ], 200);
        }

        $branch->update(['status' => 'inactive']);

        return response()->json([
            'message' => 'Cabang berhasil dinonaktifkan',
            'data'    => $branch->fresh(),
        ]);
    }


    public function activateBranch($id)
    {
        $branch = Branch::findOrFail($id);

        $branch->update(['status' => 'active']);

        return response()->json([
            'message' => 'Cabang berhasil diaktifkan kembali',
            'data'    => $branch->fresh(),
        ]);
    }


    public function listBranches(Request $request)
    {
        $query = Branch::query();


        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->boolean('with_stats')) {
            $query->withCount(['sales', 'products', 'branchStocks']);
        }

        $branches = $query->orderBy('branch_name')->get();

        return response()->json([
            'data' => $branches,
        ]);
    }


    public function showBranch($id)
    {
        $branch = Branch::with(['products', 'branchStocks'])
            ->withCount('sales')
            ->findOrFail($id);


        $salesStats = $branch->sales()
            ->where('sale_date', '>=', Carbon::now()->subDays(30))
            ->selectRaw('
                COUNT(id) as total_transactions,
                SUM(total_price) as total_revenue,
                SUM(quantity_sold) as total_units
            ')
            ->first();

        return response()->json([
            'data' => $branch,
            'stats' => [
                'last_30_days' => [
                    'transactions' => (int) ($salesStats->total_transactions ?? 0),
                    'revenue' => (float) ($salesStats->total_revenue ?? 0),
                    'units_sold' => (int) ($salesStats->total_units ?? 0),
                ],
            ],
        ]);
    }
}
