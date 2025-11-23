<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Order;
use App\Models\OrderItem;

class reportSalesController extends Controller
{
    public function reportSales(Request $request)
    {
        $request->validate([
            'period'    => 'nullable|in:daily,weekly,monthly,yearly',
            'from'      => 'nullable|date',
            'to'        => 'nullable|date|after_or_equal:from',
            'store_id'  => 'nullable|integer|exists:stores,id',
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
            'daily'   => "DATE(orders.created_at)",
            'monthly' => "DATE_FORMAT(orders.created_at, '%Y-%m-01')",
            'yearly'  => "DATE_FORMAT(orders.created_at, '%Y-01-01')",
            default   => "STR_TO_DATE(CONCAT(YEARWEEK(orders.created_at, 3), ' Monday'), '%X%V %W')",
        };

        $base = Order::query()
            ->whereBetween('created_at', [$from->toDateString(), $to->toDateString()])
            ->whereIn('status', ['COMPLETED']);

        if ($request->filled('store_id')) {
            $base->where('store_id', $request->integer('store_id'));
        }

        // Summary
        $summary = (clone $base)
            ->selectRaw('
                SUM(grand_total) as total_revenue,
                COUNT(id)        as total_transactions,
                ROUND(AVG(grand_total), 0) as avg_tx_value
            ')
            ->first();

        $totalUnitSold = OrderItem::query()
            ->whereIn('order_id', (clone $base)->pluck('id'))
            ->sum('quantity');

        // Get order IDs by period for units calculation
        $orderIdsByPeriod = (clone $base)
            ->selectRaw("{$groupByExpr} as period, GROUP_CONCAT(id) as order_ids")
            ->groupBy(DB::raw($groupByExpr))
            ->pluck('order_ids', 'period')
            ->map(fn($ids) => explode(',', $ids));

        // Visualisasi Tren (Grafik)
        $periodicSales = (clone $base)
            ->selectRaw("
                {$groupByExpr} as period,
                COUNT(id)      as transactions,
                SUM(grand_total) as revenue
            ")
            ->groupBy(DB::raw($groupByExpr))
            ->orderBy(DB::raw($groupByExpr))
            ->get()
            ->map(function ($item) use ($orderIdsByPeriod) {
                $orderIds = $orderIdsByPeriod[$item->period] ?? [];
                $item->units = $orderIds
                    ? OrderItem::whereIn('order_id', $orderIds)->sum('quantity')
                    : 0;
                return $item;
            });

        // Top Product 
        $topProduct = OrderItem::query()
            ->whereIn('order_id', (clone $base)->pluck('id'))
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw('
                products.id,
                products.name as product_name,
                SUM(order_items.quantity) as unit_sold,
                SUM(order_items.price * order_items.quantity) as revenue,
                COUNT(DISTINCT order_items.order_id) as trx_count
            ')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('unit_sold')
            ->limit($topN)
            ->get();

        // Top Product Per Periode
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
                'store_id' => $request->input('store_id'),
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
        $orderIds = $baseQuery->pluck('id');

        $results = OrderItem::query()
            ->whereIn('order_id', $orderIds)
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->selectRaw("
                {$groupByExpr} as period,
                products.id as product_id,
                products.name as product_name,
                SUM(order_items.quantity) as unit_sold,
                SUM(order_items.price * order_items.quantity) as revenue
            ")
            ->groupBy(DB::raw($groupByExpr), 'products.id', 'products.name')
            ->orderBy(DB::raw($groupByExpr))
            ->orderByDesc('unit_sold')
            ->get();

        return $results->groupBy('period')->map(function ($periodProducts) use ($limit) {
            return $periodProducts->take($limit)->values();
        });
    }
}
