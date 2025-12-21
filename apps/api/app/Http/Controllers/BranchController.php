<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Store;
use Illuminate\Validation\Rule;
use App\Traits\LogsActivity;

class BranchController extends Controller
{
    use LogsActivity;

    public function index(Request $request)
    {
        try {
            $query = Store::query();

            // Filter by active status
            if ($request->filled('is_active')) {
                $query->where('is_active', $request->boolean('is_active'));
            }

            // Search by name or code
            if ($request->filled('search')) {
                $search = $request->input('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            }

            // Load orders dengan sum grand_total untuk kolom penghasilan
            $query->withSum(['orders' => function ($query) {
                $query->where('status', 'COMPLETED')
                    ->where('payment_status', 'paid');
            }], 'grand_total');

            $branches = $query->orderByDesc('orders_sum_grand_total')->get();

            return ApiResponse::success(
                [
                    'branches' => $branches->map(function ($store) {
                        return [
                            'id' => $store->id,
                            'code' => $store->code,
                            'name' => $store->name,
                            'address' => $store->address,
                            'phone_number' => $store->phone_number,
                            'latitude' => (float) $store->latitude,
                            'longitude' => (float) $store->longitude,
                            'is_active' => (bool) $store->is_active,
                            'penghasilan' => 'Rp' . number_format($store->orders_sum_grand_total ?? 0, 0, ',', '.'),
                            'total_orders' => $store->orders_count,
                            'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                            'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
                        ];
                    }),
                    'total' => $branches->count(),
                ],
                'Data cabang berhasil diambil'
            );
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil data cabang',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function store(Request $request)
    {
        // Validasi input
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:10|unique:stores,code',
            'name' => 'required|string|max:100',
            'address' => 'required|string',
            'phone_number' => 'required|string|max:15',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        try {
            $validated = $validator->validated();
            $validated['is_active'] = true;

            $store = Store::create($validated);

            // Log activity
            $this->logActivity('CREATE', "Membuat cabang baru: {$store->name} ({$store->code})");

            return ApiResponse::created(
                [
                    'branch' => [
                        'id' => $store->id,
                        'code' => $store->code,
                        'name' => $store->name,
                        'address' => $store->address,
                        'phone_number' => $store->phone_number,
                        'latitude' => (float) $store->latitude,
                        'longitude' => (float) $store->longitude,
                        'is_active' => (bool) $store->is_active,
                        'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
                    ]
                ],
                'Cabang berhasil ditambahkan'
            );
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal menambahkan cabang',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function show($id)
    {
        try {
            $store = Store::withSum(['orders' => function ($query) {
                $query->where('status', 'COMPLETED')
                    ->where('payment_status', 'paid');
            }], 'grand_total')->find($id);

            if (!$store) {
                return ApiResponse::notFound('Cabang tidak ditemukan');
            }

            return ApiResponse::success(
                [
                    'branch' => [
                        'id' => $store->id,
                        'code' => $store->code,
                        'name' => $store->name,
                        'address' => $store->address,
                        'phone_number' => $store->phone_number,
                        'latitude' => (float) $store->latitude,
                        'longitude' => (float) $store->longitude,
                        'is_active' => (bool) $store->is_active,
                        'penghasilan' => 'Rp' . number_format($store->orders_sum_grand_total ?? 0, 0, ',', '.'),
                        'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
                    ]
                ],
                'Cabang ditemukan'
            );
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil detail cabang',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function update(Request $request, $id)
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return ApiResponse::notFound('Cabang tidak ditemukan');
            }

            // Validasi input
            $validator = Validator::make($request->all(), [
                'code' => ['sometimes', 'string', 'max:10', Rule::unique('stores', 'code')->ignore($store->id)],
                'name' => 'sometimes|string|max:100',
                'address' => 'sometimes|string',
                'phone_number' => 'sometimes|string|max:15',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
            ]);

            if ($validator->fails()) {
                return ApiResponse::validationError($validator->errors()->toArray());
            }

            $store->update($validator->validated());

            // Log activity
            $this->logActivity('UPDATE', "Memperbarui data cabang: {$store->name} ({$store->code})");

            return ApiResponse::success(
                [
                    'branch' => [
                        'id' => $store->id,
                        'code' => $store->code,
                        'name' => $store->name,
                        'address' => $store->address,
                        'phone_number' => $store->phone_number,
                        'latitude' => (float) $store->latitude,
                        'longitude' => (float) $store->longitude,
                        'is_active' => (bool) $store->is_active,
                        'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                        'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
                    ]
                ],
                'Cabang berhasil diperbarui'
            );
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal memperbarui cabang',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function deactivate($id)
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return ApiResponse::notFound('Cabang tidak ditemukan');
            }

            if (!$store->is_active) {
                return ApiResponse::error('Cabang sudah dalam status tidak aktif', 400, []);
            }

            $store->update(['is_active' => false]);

            // Log activity
            $this->logActivity('UPDATE', "Menonaktifkan cabang: {$store->name} ({$store->code})");

            return ApiResponse::success(
                [
                    'branch' => [
                        'id' => $store->id,
                        'code' => $store->code,
                        'name' => $store->name,
                        'is_active' => (bool) $store->is_active,
                    ]
                ],
                'Cabang berhasil dinonaktifkan'
            );
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal menonaktifkan cabang',
                ['error' => $e->getMessage()]
            );
        }
    }


    public function activate($id)
    {
        try {
            $store = Store::find($id);

            if (!$store) {
                return ApiResponse::notFound('Cabang tidak ditemukan');
            }

            if ($store->is_active) {
                return ApiResponse::error('Cabang sudah dalam status aktif', 400, []);
            }

            $store->update(['is_active' => true]);

            // Log activity
            $this->logActivity('UPDATE', "Mengaktifkan cabang: {$store->name} ({$store->code})");

            return ApiResponse::success(
                [
                    'branch' => [
                        'id' => $store->id,
                        'code' => $store->code,
                        'name' => $store->name,
                        'is_active' => (bool) $store->is_active,
                    ]
                ],
                'Cabang berhasil diaktifkan'
            );
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengaktifkan cabang',
                ['error' => $e->getMessage()]
            );
        }
    }

    /**
     * Get active branches for public (customers)
     * No authentication required
     */
    public function publicIndex()
    {
        try {
            $branches = Store::where('is_active', true)
                ->orderBy('name')
                ->get();

            return ApiResponse::success(
                [
                    'branches' => $branches->map(function ($store) {
                        return [
                            'id' => $store->id,
                            'code' => $store->code,
                            'name' => $store->name,
                            'address' => $store->address,
                            'phone_number' => $store->phone_number,
                        ];
                    }),
                    'total' => $branches->count(),
                ],
                'Data cabang berhasil diambil'
            );
        } catch (\Exception $e) {
            return ApiResponse::serverError(
                'Gagal mengambil data cabang',
                ['error' => $e->getMessage()]
            );
        }
    }
}
