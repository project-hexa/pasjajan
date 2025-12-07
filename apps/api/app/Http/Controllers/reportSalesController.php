<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use App\Models\Order;
use App\Models\OrderItem;

class reportSalesController extends Controller
{
    public function exportSales(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'period' => 'nullable|in:daily,monthly,yearly,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
                'store_id' => 'nullable|integer|exists:stores,id',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $period = $request->input('period', 'monthly');

            [$from, $to] = match ($period) {
                'daily' => [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()],
                'monthly' => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
                'yearly' => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
                'custom' => [
                    Carbon::parse($request->input('from'))->startOfDay(),
                    Carbon::parse($request->input('to'))->endOfDay()
                ],
                default => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
            };

            $query = OrderItem::query()
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereIn('orders.status', ['COMPLETED'])
                ->select(
                    'products.name as product_name',
                    DB::raw('SUM(order_items.quantity) as total_quantity'),
                    DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
                )
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('total_quantity');

            if ($request->filled('store_id')) {
                $query->where('orders.store_id', $request->integer('store_id'));
            }

            $products = $query->get();

            $csvData = "No,Nama Produk,Total Terjual,Total Revenue\n";

            foreach ($products as $index => $product) {
                $csvData .= sprintf(
                    "%d,%s,%d,%s\n",
                    $index + 1,
                    '"' . str_replace('"', '""', $product->product_name) . '"',
                    $product->total_quantity,
                    number_format($product->total_revenue, 0, ',', '.')
                );
            }

            return response($csvData, 200)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="sales-report-products-' . now()->format('Y-m-d-His') . '.csv"');
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal export sales report',
                ['error' => $e->getMessage()]
            );
        }
    }

    public function reportSales(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'period'    => 'nullable|in:daily,monthly,yearly,custom',
            'from'      => 'required_if:period,custom|date',
            'to'        => 'required_if:period,custom|date|after_or_equal:from',
            'store_id'  => 'nullable|integer|exists:stores,id',
            'top_n'     => 'nullable|integer|min:1|max:50',
        ]);


        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        $period = $request->input('period', 'daily');
        $topN = $request->input('top_n', 10);


        try {
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

            $periodDiff = $from->diffInDays($to);
            $previousFrom = $from->copy()->subDays($periodDiff + 1);
            $previousTo = $from->copy()->subDay();

            $previousBase = Order::query()
                ->whereBetween('created_at', [$previousFrom, $previousTo])
                ->whereIn('status', ['COMPLETED']);

            if ($request->filled('store_id')) {
                $previousBase->where('store_id', $request->integer('store_id'));
            }

            $previousSummary = $previousBase
                ->selectRaw('
                SUM(grand_total) as total_revenue,
                COUNT(id)        as total_transactions,
                ROUND(AVG(grand_total), 0) as avg_tx_value
            ')
                ->first();

            $previousCustomers = \App\Models\Customer::whereHas('orders', function ($query) use ($previousFrom, $previousTo) {
                $query->whereBetween('created_at', [$previousFrom, $previousTo])
                    ->whereIn('status', ['COMPLETED']);
            })->count();

            $currentCustomers = \App\Models\Customer::whereHas('orders', function ($query) use ($from, $to) {
                $query->whereBetween('created_at', [$from, $to])
                    ->whereIn('status', ['COMPLETED']);
            })->count();

            $customerTrend = $previousCustomers > 0
                ? round((($currentCustomers - $previousCustomers) / $previousCustomers) * 100, 1)
                : ($currentCustomers > 0 ? 100 : 0);

            $revenueTrend = $previousSummary->total_revenue > 0
                ? round((($summary->total_revenue - $previousSummary->total_revenue) / $previousSummary->total_revenue) * 100, 1)
                : ($summary->total_revenue > 0 ? 100 : 0);

            $avgTrend = $previousSummary->avg_tx_value > 0
                ? round((($summary->avg_tx_value - $previousSummary->avg_tx_value) / $previousSummary->avg_tx_value) * 100, 1)
                : ($summary->avg_tx_value > 0 ? 100 : 0);

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
                        'revenue' => 'Rp' . number_format($periodicData->get($hour)->revenue ?? 0, 0, ',', '.'),
                    ];
                }),
                'monthly' => collect(range(1, $to->daysInMonth))->map(function ($day) use ($periodicData) {
                    return [
                        'label' =>  $day,
                        'date' => Carbon::now()->startOfMonth()->addDays($day - 1)->format('Y-m-d'),
                        'value' => (int) ($periodicData->get($day)->transactions ?? 0),
                        'revenue' => 'Rp' . number_format($periodicData->get($day)->revenue ?? 0, 0, ',', '.'),
                    ];
                }),
                'yearly' => collect(range(1, 12))->map(function ($month) use ($periodicData) {
                    return [
                        'label' =>  $month,
                        'date' => Carbon::now()->startOfYear()->addMonths($month - 1)->format('Y-m'),
                        'value' => (int) ($periodicData->get($month)->transactions ?? 0),
                        'revenue' => 'Rp' . number_format($periodicData->get($month)->revenue ?? 0, 0, ',', '.'),
                    ];
                }),
                'custom' => collect(range(1, $totalDays))->map(function ($day) use ($periodicData, $from) {
                    $currentDate = $from->copy()->addDays($day - 1);
                    $dayOfMonth = (int) $currentDate->format('d');

                    return [
                        'label' => $day,
                        'date' => $currentDate->format('Y-m-d'),
                        'value' => (int) ($periodicData->get($dayOfMonth)->transactions ?? 0),
                        'revenue' => 'Rp' . number_format($periodicData->get($dayOfMonth)->revenue ?? 0, 0, ',', '.'),
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


            return ApiResponse::success(
                [
                    'parameters' => [
                        'period' => $period,
                        'store_id' => $request->input('store_id'),
                        'top_n' => $topN,
                        'date_range' => [
                            'from' => $from->format('Y-m-d H:i:s'),
                            'to' => $to->format('Y-m-d H:i:s'),
                        ],
                    ],
                    'summary' => [
                        'total_customers' => [
                            'value' => $currentCustomers,
                            'trend' => ($customerTrend >= 0 ? '+' : '') . $customerTrend . '%',
                            'description' => $customerTrend >= 0 ? 'Naik dari periode sebelumnya' : 'Turun dari periode sebelumnya',
                        ],
                        'total_transactions' => [
                            'value' => 'Rp' . number_format($summary->total_revenue ?? 0, 0, ',', '.'),
                            'trend' => ($revenueTrend >= 0 ? '+' : '') . $revenueTrend . '%',
                            'description' => $revenueTrend >= 0 ? 'Naik dari periode sebelumnya' : 'Turun dari periode sebelumnya',
                        ],
                        'avg_transaction' => [
                            'value' => 'Rp' . number_format($summary->avg_tx_value ?? 0, 0, ',', '.'),
                            'trend' => ($avgTrend >= 0 ? '+' : '') . $avgTrend . '%',
                            'description' => $avgTrend >= 0 ? 'Naik dari periode sebelumnya' : 'Turun dari periode sebelumnya',
                        ],
                    ],
                    'salesTrend' => $salesTrend->values(),
                    'topProducts' => $topProduct->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'name' => $item->product_name,
                            'unitSold' => (int) $item->unit_sold,
                            'revenue' => 'Rp' . number_format($item->revenue, 0, ',', '.'),
                        ];
                    })->values(),
                ],
                'Laporan penjualan berhasil diambil'
            );
        } catch (\Exception $e) {
            // STEP 5: Return error jika terjadi exception
            return ApiResponse::serverError(
                'Gagal mengambil laporan penjualan',
                ['error' => $e->getMessage()]
            );
        }
    }
}
