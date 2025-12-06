<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use App\Helpers\ApiResponse;

class CustomerController extends Controller
{

    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'period' => 'nullable|in:daily,monthly,yearly,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
                'per_page' => 'nullable|integer|min:5|max:100',
                'page' => 'nullable|integer|min:1',
                'search' => 'nullable|string|max:255',
                'sort' => 'nullable|in:highest,lowest',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $period = $request->input('period', 'monthly');
            $perPage = $request->input('per_page', 10);
            $page = $request->input('page', 1);
            $search = $request->input('search');
            $sort = $request->input('sort');

            [$from, $to] = $this->getDateRange($period, $request);

            $query = Order::query()
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->join('users', 'customers.user_id', '=', 'users.id')
                ->select(
                    'orders.id',
                    DB::raw("CONCAT(users.first_name, ' ', users.last_name) as customer_name"),
                    'orders.created_at as transaction_date',
                    'orders.grand_total as total_payment'
                )
                ->where('users.role', 'customer')
                ->whereIn('orders.status', ['COMPLETED'])
                ->whereBetween('orders.created_at', [$from, $to]);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereRaw('LOWER(users.first_name) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(users.last_name) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(users.email) LIKE ?', ['%' . strtolower($search) . '%']);
                });
            }

            if ($sort) {
                if ($sort === 'highest') {
                    $query->orderBy('orders.grand_total', 'desc');
                } else {
                    $query->orderBy('orders.grand_total', 'asc');
                }
            } else {
                $query->orderBy('orders.created_at', 'desc');
            }

            $ordersPaginated = $query->paginate($perPage, ['*'], 'page', $page);

            $customers = $ordersPaginated->map(function ($order) {
                $totalItems = OrderItem::where('order_id', $order->id)->sum('quantity');

                return [
                    'customer_name' => $order->customer_name,
                    'transaction_date' => Carbon::parse($order->transaction_date)->format('Y-m-d H:i:s'),
                    'total_items' => (int) $totalItems,
                    'total_payment' => 'Rp' . number_format($order->total_payment, 0, ',', '.'),
                ];
            });

            return ApiResponse::success([
                'period' => [
                    'filter' => $period,
                    'from' => $from->format('Y-m-d'),
                    'to' => $to->format('Y-m-d'),
                ],
                'customers' => $customers,
                'pagination' => [
                    'current_page' => $ordersPaginated->currentPage(),
                    'per_page' => $ordersPaginated->perPage(),
                    'total' => $ordersPaginated->total(),
                    'last_page' => $ordersPaginated->lastPage(),
                    'from' => $ordersPaginated->firstItem(),
                    'to' => $ordersPaginated->lastItem(),
                ],
            ], 'Data pelanggan berhasil diambil');
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil data pelanggan',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function analytics(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'period' => 'nullable|in:daily,monthly,yearly,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $period = $request->input('period', 'monthly');
            [$from, $to] = $this->getDateRange($period, $request);

            // Calculate summary cards
            $summary = $this->getSummaryCards($from, $to);

            // Get analytics charts
            $purchaseTrend = $this->getPurchaseTrend($from, $to, $period);
            $categoryComposition = $this->getCategoryComposition($from, $to);
            $purchaseFrequency = $this->getPurchaseFrequency($from, $to);

            return ApiResponse::success([
                'period' => [
                    'filter' => $period,
                    'from' => $from->format('Y-m-d'),
                    'to' => $to->format('Y-m-d'),
                ],
                'summary' => $summary,
                'analytics' => [
                    'purchase_trend' => $purchaseTrend,
                    'category_composition' => $categoryComposition,
                    'purchase_frequency' => $purchaseFrequency,
                ],
            ], 'Data analytics berhasil diambil');
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil data analytics',
                ['error' => $e->getMessage()]
            );
        }
    }

    public function exportCustomers(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $search = $request->input('search');

            $query = Order::query()
                ->join('customers', 'orders.customer_id', '=', 'customers.id')
                ->join('users', 'customers.user_id', '=', 'users.id')
                ->select(
                    'orders.id',
                    DB::raw("CONCAT(users.first_name, ' ', users.last_name) as customer_name"),
                    'orders.created_at as transaction_date',
                    'orders.grand_total as total_payment'
                )
                ->where('users.role', 'customer')
                ->whereIn('orders.status', ['COMPLETED']);

            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->whereRaw('LOWER(users.first_name) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(users.last_name) LIKE ?', ['%' . strtolower($search) . '%'])
                        ->orWhereRaw('LOWER(users.email) LIKE ?', ['%' . strtolower($search) . '%']);
                });
            }

            $orders = $query->orderBy('orders.created_at', 'desc')->get();

            $csvData = "No,Nama Customer,Tanggal Transaksi,Total Item,Total Bayar\n";

            foreach ($orders as $index => $order) {
                $totalItems = OrderItem::where('order_id', $order->id)->sum('quantity');

                $csvData .= sprintf(
                    "%d,%s,%s,%d,%s\n",
                    $index + 1,
                    '"' . str_replace('"', '""', $order->customer_name) . '"',
                    Carbon::parse($order->transaction_date)->format('Y-m-d H:i:s'),
                    $totalItems,
                    number_format($order->total_payment, 0, ',', '.')
                );
            }

            return response($csvData, 200)
                ->header('Content-Type', 'text/csv; charset=UTF-8')
                ->header('Content-Disposition', 'attachment; filename="customer-transactions-' . now()->format('Y-m-d-His') . '.csv"');
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal export data customers',
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

            return ApiResponse::success([
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
            ], 'Hasil pencarian pelanggan');
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

            return ApiResponse::success([
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
            ], 'Detail pelanggan ditemukan');
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil detail pelanggan',
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

            return ApiResponse::success([
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
            ], 'Data pembelian pelanggan');
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
                'period' => 'nullable|in:daily,monthly,yearly,custom',
                'from' => 'required_if:period,custom|date',
                'to' => 'required_if:period,custom|date|after_or_equal:from',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $period = $request->input('period', 'monthly');
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

    private function getSummaryCards($from, $to)
    {
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

        return [
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
        ];
    }

    private function getOrdersQuery($from, $to, $search = null, $sort = null)
    {
        $query = Order::with(['customer.user', 'orderItems'])
            ->whereBetween('orders.created_at', [$from, $to])
            ->whereIn('orders.status', ['COMPLETED'])
            ->join('customers', 'orders.customer_id', '=', 'customers.id')
            ->join('users', 'customers.user_id', '=', 'users.id')
            ->where('users.role', 'customer')
            ->select('orders.*');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('users.first_name', 'like', "%{$search}%")
                    ->orWhere('users.last_name', 'like', "%{$search}%")
                    ->orWhere('users.email', 'like', "%{$search}%");
            });
        }

        if ($sort === 'top') {
            $query->orderBy('orders.grand_total', 'desc');
        } else {
            $query->orderBy('orders.created_at', 'desc');
        }

        return $query;
    }

    private function formatOrdersList($ordersPaginated)
    {
        return $ordersPaginated->map(function ($order) {
            $totalItems = $order->orderItems->sum('quantity');

            return [
                'customer_name' => $order->customer->user->first_name . ' ' . $order->customer->user->last_name,
                'transaction_date' => $order->created_at->format('Y-m-d H:i:s'),
                'total_items' => $totalItems,
                'total_payment' => 'Rp' . number_format($order->grand_total, 0, ',', '.'),
            ];
        });
    }

    private function getDateRange($period, $request)
    {
        return match ($period) {
            'daily' => [Carbon::now()->startOfDay(), Carbon::now()->endOfDay()],
            'monthly' => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
            'yearly' => [Carbon::now()->startOfYear(), Carbon::now()->endOfYear()],
            'custom' => [
                Carbon::parse($request->input('from'))->startOfDay(),
                Carbon::parse($request->input('to'))->endOfDay()
            ],
            default => [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()],
        };
    }

    private function getPurchaseTrend($from, $to, $period)
    {
        if ($period === 'daily') {
            $orders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->selectRaw('HOUR(created_at) as hour, COUNT(*) as count, SUM(grand_total) as revenue')
                ->groupBy('hour')
                ->get()
                ->keyBy('hour');

            return collect(range(0, 23))->map(function ($hour) use ($orders) {
                $order = $orders->get($hour);
                return [
                    'label' => $hour,
                    'date' => Carbon::now()->startOfDay()->addHours($hour)->format('Y-m-d H:00:00'),
                    'value' => $order ? (int) $order->count : 0,
                    'revenue' => $order ? 'Rp' . number_format($order->revenue, 0, ',', '.') : 'Rp0',
                ];
            });
        }

        if ($period === 'monthly') {
            $orders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(grand_total) as revenue')
                ->groupBy('date')
                ->get()
                ->keyBy('date');

            $days = $from->diffInDays($to);
            return collect(range(0, $days))->map(function ($day) use ($from, $orders) {
                $date = $from->copy()->addDays($day);
                $dateStr = $date->format('Y-m-d');
                $order = $orders->get($dateStr);

                return [
                    'label' => $date->day,
                    'date' => $dateStr,
                    'value' => $order ? (int) $order->count : 0,
                    'revenue' => $order ? 'Rp' . number_format($order->revenue, 0, ',', '.') : 'Rp0',
                ];
            });
        }

        if ($period === 'yearly') {
            $orders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['COMPLETED'])
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as count, SUM(grand_total) as revenue')
                ->groupBy('month')
                ->get()
                ->keyBy('month');

            return collect(range(1, 12))->map(function ($month) use ($orders) {
                $order = $orders->get($month);
                return [
                    'label' => $month,
                    'date' => Carbon::now()->month($month)->format('Y-m'),
                    'value' => $order ? (int) $order->count : 0,
                    'revenue' => $order ? 'Rp' . number_format($order->revenue, 0, ',', '.') : 'Rp0',
                ];
            });
        }

        $orders = Order::whereBetween('created_at', [$from, $to])
            ->whereIn('status', ['COMPLETED'])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(grand_total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return $orders->map(function ($item) {
            $date = Carbon::parse($item->date);
            return [
                'label' => $date->day,
                'date' => $item->date,
                'value' => (int) $item->count,
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
