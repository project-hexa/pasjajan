<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Http\Helpers\ApiResponse;

class CustomerController extends Controller
{

    public function index(Request $request)
    {
        try {

            $validator = Validator::make($request->all(), [
                'period' => 'nullable|in:1d,7h,30h,3b,6b,1th,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
                'per_page' => 'nullable|integer|min:5|max:100',
                'page' => 'nullable|integer|min:1',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }


            $period = $request->input('period', '30d');
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            [$from, $to] = $this->getDateRange($period, $request);

            $totalCustomers = Customer::whereHas('orders', function ($query) use ($from, $to) {
                $query->whereBetween('created_at', [$from, $to])
                    ->whereIn('status', ['COMPLETED']);
            })->count();

            $totalOrders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->count();

            $totalRevenue = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->sum('grand_total');

            $avgOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

            $periodDiff = $from->diffInDays($to);
            $previousFrom = $from->copy()->subDays($periodDiff + 1);
            $previousTo = $from->copy()->subDay();

            $previousCustomers = Customer::whereHas('orders', function ($query) use ($previousFrom, $previousTo) {
                $query->whereBetween('created_at', [$previousFrom, $previousTo])
                    ->whereIn('status', ['COMPLETED']);
            })->count();

            $previousRevenue = Order::whereBetween('created_at', [$previousFrom, $previousTo])
                ->whereIn('status', ['COMPLETED'])
                ->sum('grand_total');

            $previousOrders = Order::whereBetween('created_at', [$previousFrom, $previousTo])
                ->whereIn('status', ['COMPLETED'])
                ->count();

            $previousAvgOrderValue = $previousOrders > 0 ? $previousRevenue / $previousOrders : 0;

            $customerTrend = $previousCustomers > 0
                ? round((($totalCustomers - $previousCustomers) / $previousCustomers) * 100, 1)
                : ($totalCustomers > 0 ? 100 : 0);

            $revenueTrend = $previousRevenue > 0
                ? round((($totalRevenue - $previousRevenue) / $previousRevenue) * 100, 1)
                : ($totalRevenue > 0 ? 100 : 0);

            $avgTrend = $previousAvgOrderValue > 0
                ? round((($avgOrderValue - $previousAvgOrderValue) / $previousAvgOrderValue) * 100, 1)
                : ($avgOrderValue > 0 ? 100 : 0);


            $topCustomers = Customer::with('user')
                ->withCount(['orders' => function ($query) use ($from, $to) {
                    $query->whereBetween('created_at', [$from, $to])
                        ->whereIn('status', ['COMPLETED']);
                }])
                ->withSum(['orders as total_price' => function ($query) use ($from, $to) {
                    $query->whereBetween('created_at', [$from, $to])
                        ->whereIn('status', ['COMPLETED']);
                }], 'grand_total')
                ->having('orders_count', '>', 0)
                ->orderBy('orders_count', 'desc')
                ->take(10)
                ->get()
                ->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'customer_name' => $customer->user->first_name . ' ' . $customer->user->last_name,
                        'email' => $customer->user->email,
                        'quantity' => $customer->orders_count,
                        'total_price' => (float) ($customer->total_price ?? 0),
                    ];
                });

            $customersQuery = Customer::with('user')
                ->withCount(['orders' => function ($query) use ($from, $to) {
                    $query->whereBetween('created_at', [$from, $to])
                        ->whereIn('status', ['COMPLETED']);
                }])
                ->withSum(['orders as total_price' => function ($query) use ($from, $to) {
                    $query->whereBetween('created_at', [$from, $to])
                        ->whereIn('status', ['COMPLETED']);
                }], 'grand_total');

            $allCustomersPaginated = $customersQuery->paginate($perPage, ['*'], 'page', $page);

            $allCustomers = $allCustomersPaginated->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'customer_name' => $customer->user->first_name . ' ' . $customer->user->last_name,
                    'quantity' => $customer->orders_count,
                    'total_price' => (float) ($customer->total_price ?? 0),

                ];
            });

            $purchaseTrend = $this->getPurchaseTrend($from, $to, $period);
            $categoryComposition = $this->getCategoryComposition($from, $to);
            $purchaseFrequency = $this->getPurchaseFrequency($from, $to);

            return ApiResponse::success('Data pelanggan berhasil diambil', [
                'period' => [
                    'filter' => $period,
                    'from' => $from->format('Y-m-d'),
                    'to' => $to->format('Y-m-d'),
                ],
                'summary' => [
                    'total_customers' => [
                        'value' => $totalCustomers,
                        'trend' => ($customerTrend >= 0 ? '+' : '') . $customerTrend . '%',
                        'description' => $customerTrend >= 0 ? 'Naik dari periode sebelumnya' : 'Turun dari periode sebelumnya',
                    ],
                    'total_transactions' => [
                        'value' => 'Rp' . number_format($totalRevenue, 0, ',', '.'),
                        'trend' => ($revenueTrend >= 0 ? '+' : '') . $revenueTrend . '%',
                        'description' => $revenueTrend >= 0 ? 'Naik dari periode sebelumnya' : 'Turun dari periode sebelumnya',
                    ],
                    'avg_transaction' => [
                        'value' => 'Rp' . number_format($avgOrderValue, 0, ',', '.'),
                        'trend' => ($avgTrend >= 0 ? '+' : '') . $avgTrend . '%',
                        'description' => $avgTrend >= 0 ? 'Naik dari periode sebelumnya' : 'Turun dari periode sebelumnya',
                    ],
                ],
                'top_customers' => $topCustomers,
                'customers' => $allCustomers,
                'pagination' => [
                    'current_page' => $allCustomersPaginated->currentPage(),
                    'per_page' => $allCustomersPaginated->perPage(),
                    'total' => $allCustomersPaginated->total(),
                    'last_page' => $allCustomersPaginated->lastPage(),
                    'from' => $allCustomersPaginated->firstItem(),
                    'to' => $allCustomersPaginated->lastItem(),
                ],
                'analytics' => [
                    'purchase_trend' => $purchaseTrend,
                    'category_composition' => $categoryComposition,
                    'purchase_frequency' => $purchaseFrequency,
                ],
            ]);
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil data pelanggan',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function search(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $query = Customer::with('user')
                ->withCount('orders')
                ->withSum(['orders as total_price' => function ($q) {
                    $q->whereIn('status', ['COMPLETED']);
                }], 'grand_total');


            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->whereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('first_name', 'like', "%{$search}%");
                    })->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('last_name', 'like', "%{$search}%");
                    })->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('email', 'like', "%{$search}%");
                    });
                });
            }

            $customers = $query->get();

            return ApiResponse::success('Hasil pencarian pelanggan', [
                'customers' => $customers->map(function ($customer) {
                    return [
                        'id' => $customer->id,
                        'customer_name' => $customer->user->first_name . ' ' . $customer->user->last_name,
                        'email' => $customer->user->email,
                        'quantity' => $customer->orders_count,
                        'total_price' => (float) ($customer->total_price ?? 0),
                        'formatted_total_price' => 'Rp' . number_format($customer->total_price ?? 0, 0, ',', '.'),
                        'phone' => $customer->user->phone_number,
                        'created_at' => $customer->created_at->format('Y-m-d H:i:s'),
                    ];
                }),
                'total' => $customers->count(),
            ]);
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mencari pelanggan',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function show($id)
    {
        try {
            $customer = Customer::with('user')->withCount('orders')->find($id);

            if (!$customer) {
                return ApiResponse::notFound('Pelanggan tidak ditemukan');
            }


            $orders = Order::where('customer_id', $id)
                ->whereIn('status', ['COMPLETED'])
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get()
                ->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'date' => $order->created_at->format('Y-m-d H:i:s'),
                        'total' => (float) $order->grand_total,
                        'formatted_total' => 'Rp' . number_format($order->grand_total, 0, ',', '.'),
                        'status' => $order->status,
                    ];
                });

            $totalSpent = Order::where('customer_id', $id)
                ->whereIn('status', ['COMPLETED'])
                ->sum('grand_total');

            return ApiResponse::success('Detail pelanggan ditemukan', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->user->first_name . ' ' . $customer->user->last_name,
                    'email' => $customer->user->email,
                    'phone' => $customer->user->phone_number,
                    'total_orders' => $customer->orders_count,
                    'total_spent' => (float) $totalSpent,
                    'formatted_total_spent' => 'Rp' . number_format($totalSpent, 0, ',', '.'),
                    'member_since' => $customer->created_at->format('Y-m-d'),
                ],
                'recent_orders' => $orders,
            ]);
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil detail pelanggan',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function analytics(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'period' => 'nullable|in:7d,30d,3m,6m,1y,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $period = $request->input('period', '30d');
            [$from, $to] = $this->getDateRange($period, $request);

            $purchaseTrend = $this->getPurchaseTrend($from, $to, $period);


            $categoryComposition = $this->getCategoryComposition($from, $to);

            $purchaseFrequency = $this->getPurchaseFrequency($from, $to);

            return ApiResponse::success('Data analytics berhasil diambil', [
                'period' => [
                    'filter' => $period,
                    'from' => $from->format('Y-m-d'),
                    'to' => $to->format('Y-m-d'),
                ],
                'purchase_trend' => $purchaseTrend,
                'category_composition' => $categoryComposition,
                'purchase_frequency' => $purchaseFrequency,
            ]);
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil data analytics',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function purchases(Request $request, $customerId)
    {
        try {
            $customer = Customer::find($customerId);

            if (!$customer) {
                return ApiResponse::notFound('Pelanggan tidak ditemukan');
            }

            $perPage = $request->input('per_page', 15);

            $orders = Order::where('customer_id', $customerId)
                ->with('orderItems.product')
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            return ApiResponse::success('Data pembelian pelanggan', [
                'purchases' => $orders->map(function ($order) {
                    return [
                        'id' => $order->id,
                        'date' => $order->created_at->format('Y-m-d H:i:s'),
                        'items_count' => $order->orderItems->count(),
                        'total' => (float) $order->grand_total,
                        'formatted_total' => 'Rp' . number_format($order->grand_total, 0, ',', '.'),
                        'status' => $order->status,
                        'items' => $order->orderItems->map(function ($item) {
                            return [
                                'product_name' => $item->product->name,
                                'quantity' => $item->quantity,
                                'price' => (float) $item->price,
                            ];
                        }),
                    ];
                }),
                'pagination' => [
                    'total' => $orders->total(),
                    'per_page' => $orders->perPage(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil data pembelian',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function export(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'period' => 'nullable|in:7d,30d,3m,6m,1y,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $period = $request->input('period', '30d');
            [$from, $to] = $this->getDateRange($period, $request);

            $customers = Customer::with('user')
                ->withCount(['orders' => function ($query) use ($from, $to) {
                    $query->whereBetween('created_at', [$from, $to])
                        ->whereIn('status', ['COMPLETED']);
                }])
                ->withSum(['orders as total_spent' => function ($query) use ($from, $to) {
                    $query->whereBetween('created_at', [$from, $to])
                        ->whereIn('status', ['COMPLETED']);
                }], 'grand_total')
                ->get();

            $csvData = "ID,Name,Email,Phone,Total Orders,Total Spent,Member Since\n";

            foreach ($customers as $customer) {
                $csvData .= sprintf(
                    "%d,%s,%s,%s,%d,%s,%s\n",
                    $customer->id,
                    $customer->user->first_name . ' ' . $customer->user->last_name,
                    $customer->user->email,
                    $customer->user->phone_number,
                    $customer->orders_count,
                    number_format($customer->total_spent ?? 0, 0, '.', ''),
                    $customer->created_at->format('Y-m-d')
                );
            }

            return response($csvData, 200)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="customers-export-' . now()->format('Y-m-d') . '.csv"');
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal export data',
                ['error' => $e->getMessage()]
            );
        }
    }


    private function getDateRange($period, $request)
    {
        return match ($period) {
            '1d' => [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()],
            '7h' => [Carbon::now()->subDays(6)->startOfDay(), Carbon::now()->endOfDay()],
            '30h' => [Carbon::now()->subDays(29)->startOfDay(), Carbon::now()->endOfDay()],
            '3b' => [Carbon::now()->subMonths(3)->startOfDay(), Carbon::now()->endOfDay()],
            '6b' => [Carbon::now()->subMonths(6)->startOfDay(), Carbon::now()->endOfDay()],
            '1th' => [Carbon::now()->subYear()->startOfDay(), Carbon::now()->endOfDay()],
            'custom' => [
                Carbon::parse($request->input('from'))->startOfDay(),
                Carbon::parse($request->input('to'))->endOfDay()
            ],
            default => [Carbon::now()->subDays(29)->startOfDay(), Carbon::now()->endOfDay()],
        };
    }


    private function getPurchaseTrend($from, $to, $period)
    {
        if ($period === '1d') {
            $orders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count, SUM(grand_total) as revenue')
                ->groupBy('hour')
                ->get()
                ->keyBy('hour');

            return collect(range(0, 23))->map(function ($hour) use ($orders) {
                $order = $orders->get($hour);
                return [
                    'date' => Carbon::now()->startOfDay()->addHours($hour)->format('Y-m-d H:00:00'),
                    'label' => $hour . ':00',
                    'transactions' => $order ? (int) $order->count : 0,
                    'revenue' => $order ? 'Rp' . number_format($order->revenue, 0, ',', '.') : 'Rp0',
                ];
            });
        }

        if ($period === '7h') {
            $orders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(grand_total) as revenue')
                ->groupBy('date')
                ->get()
                ->keyBy('date');

            return collect(range(0, 6))->map(function ($day) use ($from, $orders) {
                $date = $from->copy()->addDays($day);
                $dateStr = $date->format('Y-m-d');
                $order = $orders->get($dateStr);

                return [
                    'date' => $dateStr,
                    'label' => $date->format('d M'),
                    'transactions' => $order ? (int) $order->count : 0,
                    'revenue' => $order ? 'Rp' . number_format($order->revenue, 0, ',', '.') : 'Rp0',
                ];
            });
        }

        if ($period === '30h') {
            $orders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(grand_total) as revenue')
                ->groupBy('date')
                ->get()
                ->keyBy('date');

            return collect(range(0, 29))->map(function ($day) use ($from, $orders) {
                $date = $from->copy()->addDays($day);
                $dateStr = $date->format('Y-m-d');
                $order = $orders->get($dateStr);

                return [
                    'date' => $dateStr,
                    'label' => $date->format('d M'),
                    'transactions' => $order ? (int) $order->count : 0,
                    'revenue' => $order ? 'Rp' . number_format($order->revenue, 0, ',', '.') : 'Rp0',
                ];
            });
        }

        $groupBy = match ($period) {
            '3b', '6b', '1th' => 'DATE_FORMAT(created_at, "%Y-%m")',
            default => 'DATE(created_at)',
        };

        $trend = Order::whereBetween('created_at', [$from, $to])
            ->whereIn('status', ['COMPLETED'])
            ->selectRaw("{$groupBy} as date, COUNT(*) as count, SUM(grand_total) as revenue")
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $trend->map(function ($item) {
            return [
                'date' => $item->date,
                'transactions' => (int) $item->count,
                'revenue' => 'Rp' . number_format($item->revenue, 0, ',', '.'),
            ];
        });
    }


    private function getCategoryComposition($from, $to)
    {
        $composition = OrderItem::join('orders', 'orders.id', '=', 'order_items.order_id')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('product_categories', 'product_categories.id', '=', 'products.product_category_id')
            ->whereBetween('orders.created_at', [$from, $to])
            ->whereIn('orders.status', ['COMPLETED'])
            ->selectRaw('product_categories.name as category, COUNT(*) as count, SUM(order_items.quantity) as total_quantity')
            ->groupBy('product_categories.id', 'product_categories.name')
            ->get();

        $total = $composition->sum('total_quantity');

        return $composition->map(function ($item) use ($total) {
            $percentage = $total > 0 ? ($item->total_quantity / $total) * 100 : 0;
            return [
                'category' => $item->category,
                'quantity' => (int) $item->total_quantity,
                'percentage' => round($percentage, 2),
            ];
        });
    }


    private function getPurchaseFrequency($from, $to)
    {
        $frequency = Order::whereBetween('created_at', [$from, $to])
            ->whereIn('status', ['COMPLETED'])
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as count')
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        return $frequency->map(function ($item) {
            return [
                'period' => Carbon::create($item->year, $item->month)->format('M Y'),
                'month' => (int) $item->month,
                'year' => (int) $item->year,
                'transactions' => (int) $item->count,
            ];
        });
    }
}
