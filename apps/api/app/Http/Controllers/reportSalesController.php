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
            'period'    => 'nullable|in:daily,monthly,yearly,custom',
            'from'      => 'required_if:period,custom|date',
            'to'        => 'required_if:period,custom|date|after_or_equal:from',
            'store_id'  => 'nullable|integer|exists:stores,id',
            'top_n'     => 'nullable|integer|min:1|max:50',
        ]);

        $period = $request->input('period', 'daily');
        $topN = $request->input('top_n', 10);

        [$from, $to] = match ($period) {
            'daily'   => [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()],
            'monthly' => [Carbon::now()->startOfMonth(), Carbon::now()->endOfDay()],
            'yearly'  => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
            'custom'  => [
                Carbon::parse($request->input('from'))->startOfDay(),
                Carbon::parse($request->input('to'))->endOfDay()
            ],
            default   => [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()],
        };


        $totalDays = $from->diffInDays($to) + 1;

        $groupByExpr = match ($period) {
            'daily'   => "HOUR(orders.created_at)",
            'monthly' => "DAY(orders.created_at)",
            'yearly'  => "MONTH(orders.created_at)",
            'custom'  => "DAY(orders.created_at)",
            default   => "HOUR(orders.created_at)",
        };

        $base = Order::query()
            ->whereBetween('created_at', [$from, $to])
            ->whereIn('status', ['COMPLETED']);

        if ($request->filled('store_id')) {
            $base->where('store_id', $request->integer('store_id'));
        }


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

        $periodicData = (clone $base)
            ->selectRaw("
                {$groupByExpr} as period,
                COUNT(id)      as transactions,
                SUM(grand_total) as revenue
            ")
            ->groupBy(DB::raw($groupByExpr))
            ->orderBy(DB::raw($groupByExpr))
            ->get()
            ->keyBy('period');


        $salesTrend = match ($period) {
            'daily' => collect(range(0, 23))->map(function ($hour) use ($periodicData) {
                return [
                    'label' =>  $hour,
                    'date' => Carbon::now()->startOfDay()->addHours($hour)->format('Y-m-d H:i:s'),
                    'value' => (int) ($periodicData->get($hour)->transactions ?? 0),
                    'revenue' => (float) ($periodicData->get($hour)->revenue ?? 0),
                ];
            }),
            'monthly' => collect(range(1, $to->daysInMonth))->map(function ($day) use ($periodicData) {
                return [
                    'label' =>  $day,
                    'date' => Carbon::now()->startOfMonth()->addDays($day - 1)->format('Y-m-d'),
                    'value' => (int) ($periodicData->get($day)->transactions ?? 0),
                    'revenue' => (float) ($periodicData->get($day)->revenue ?? 0),
                ];
            }),
            'yearly' => collect(range(1, 12))->map(function ($month) use ($periodicData) {
                return [
                    'label' =>  $month,
                    'date' => Carbon::now()->startOfYear()->addMonths($month - 1)->format('Y-m'),
                    'value' => (int) ($periodicData->get($month)->transactions ?? 0),
                    'revenue' => (float) ($periodicData->get($month)->revenue ?? 0),
                ];
            }),
            'custom' => collect(range(1, $totalDays))->map(function ($day) use ($periodicData, $from) {
                $currentDate = $from->copy()->addDays($day - 1);
                $dayOfMonth = (int) $currentDate->format('d');

                return [
                    'label' => $day,
                    'date' => $currentDate->format('Y-m-d'),
                    'value' => (int) ($periodicData->get($dayOfMonth)->transactions ?? 0),
                    'revenue' => (float) ($periodicData->get($dayOfMonth)->revenue ?? 0),
                ];
            }),
            default => collect([]),
        };

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

        return response()->json([
            'parameters' => [
                'period' => $period,
                'store_id' => $request->input('store_id'),
                'top_n' => $topN,
            ],
            'data' => [
                'summary' => [
                    'totalRevenue' => 'Rp' . number_format($summary->total_revenue ?? 0, 0, ',', '.'),
                    'totalTransactions' => $summary->total_transactions ?? 0,
                    'averageTransactionValue' => 'Rp' . number_format($summary->avg_tx_value ?? 0, 0, ',', '.'),
                    'totalUnitSold' => (int) $totalUnitSold,
                ],
                'salesTrend' => $salesTrend,
                'topProducts' => $topProduct->map(function ($item) {
                    return [
                        'name' => $item->product_name,
                        'unitSold' => (int) $item->unit_sold,
                        'revenue' => 'Rp' . number_format($item->revenue, 0, ',', '.'),
                        'sort' => (int) $item->unit_sold,
                    ];
                }),
            ],
        ]);
    }
}
