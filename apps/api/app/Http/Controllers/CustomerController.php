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
                'period' => 'nullable|in:7d,30d,3m,6m,1y,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
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
                    'email' => $customer->user->email,
                    'quantity' => $customer->orders_count,
                    'total_price' => (float) ($customer->total_price ?? 0),
                    'phone' => $customer->user->phone_number,
                    'created_at' => $customer->created_at->format('Y-m-d H:i:s'),
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
                    ],
                    'total_transactions' => [
                        'value' => (float) $totalRevenue,
                        'trend' => ($revenueTrend >= 0 ? '+' : '') . $revenueTrend . '%',
                    ],
                    'avg_transaction' => [
                        'value' => (float) $avgOrderValue,
                        'trend' => ($avgTrend >= 0 ? '+' : '') . $avgTrend . '%',
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
            '7d' => [Carbon::now()->subDays(7)->startOfDay(), Carbon::now()->endOfDay()],
            '30d' => [Carbon::now()->subDays(30)->startOfDay(), Carbon::now()->endOfDay()],
            '3m' => [Carbon::now()->subMonths(3)->startOfDay(), Carbon::now()->endOfDay()],
            '6m' => [Carbon::now()->subMonths(6)->startOfDay(), Carbon::now()->endOfDay()],
            '1y' => [Carbon::now()->subYear()->startOfDay(), Carbon::now()->endOfDay()],
            'custom' => [
                Carbon::parse($request->input('from'))->startOfDay(),
                Carbon::parse($request->input('to'))->endOfDay()
            ],
            default => [Carbon::now()->subDays(30)->startOfDay(), Carbon::now()->endOfDay()],
        };
    }


    private function getPurchaseTrend($from, $to, $period)
    {
        $groupBy = match ($period) {
            '7d', '30d' => 'DATE(created_at)',
            '3m', '6m', '1y' => 'DATE_FORMAT(created_at, "%Y-%m")',
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
                'revenue' => (float) $item->revenue,
                'formatted_revenue' => 'Rp' . number_format($item->revenue, 0, ',', '.'),
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
