<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\PromoResource;
use App\Models\Promo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Helpers\ApiResponse;
use App\Traits\LogsActivity;

class PromoController extends Controller
{
    use LogsActivity;
    /**
     * GET /api/promos/active
     *
     * Query params opsional:
     * - store_id
     * - product_id
     * - per_page
     */
    public function active(Request $request)
    {
        $storeId = $request->query('store_id');
        $productId = $request->query('product_id');
        $perPage = $request->query('per_page', 10);

        $promos = Promo::with(['stores', 'products'])
            ->active($storeId, $productId)
            ->orderBy('start_date', 'asc')
            ->paginate($perPage);

        return ApiResponse::success(
            PromoResource::collection($promos)->response()->getData(true),
            'Active promos retrieved successfully'
        );
    }

    public function show($id, Request $request)
    {
        $promo = Promo::with(['products', 'stores'])
            ->where('id', $id)
            ->first();

        if (!$promo) {
            return ApiResponse::notFound('Promo not found');
        }

        return ApiResponse::success(
            new PromoResource($promo),
            'Promo retrieved successfully'
        );
    }

    private function ensureAdmin()
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Admin') {
            abort(ApiResponse::forbidden('Forbidden. Only admin can manage promos.'));
        }
    }

    /**
     * GET /api/admin/promos
     * List semua promo (admin only)
     */
    public function index(Request $request)
    {
        $this->ensureAdmin();

        $perPage = $request->query('per_page', 15);

        $promos = Promo::with(['stores', 'products'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return ApiResponse::success(
            PromoResource::collection($promos)->response()->getData(true),
            'Promos retrieved successfully'
        );
    }

    /**
     * POST /api/admin/promos
     * Tambah promo baru
     */
    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'banner' => 'nullable|image|max:2048', // 2MB max
            'description' => 'nullable|string',
            'discount_percentage' => 'required|numeric|min:1|max:100',
            'min_order_value' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:Active,Non-active',
            'applies_to' => 'nullable|in:All,Specific',
            'applies_to_product' => 'nullable|in:All,Specific',

            // relasi (opsional)
            'store_ids' => 'array',
            'store_ids.*' => 'integer|exists:stores,id',

            'product_ids' => 'array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        $data = $validator->validated();

        // pisahkan relasi
        $storeIds = $data['store_ids'] ?? [];
        $productIds = $data['product_ids'] ?? [];

        unset($data['store_ids'], $data['product_ids']);

        // isi created_by dari admin yang login
        $data['created_by'] = Auth::id();

        if ($request->hasFile('banner')) {
            $data['banner'] = $request->file('banner')->store('promos/banners', 'public');
        }

        $promo = Promo::create($data);

        // sync relasi
        if (!empty($storeIds)) {
            $promo->stores()->sync($storeIds);
        }

        if (!empty($productIds)) {
            $promo->products()->sync($productIds);
        }

        $promo->load(['stores', 'products']);

        // Log activity
        $this->logActivity('CREATE', "Membuat promo baru: {$promo->name}");

        return ApiResponse::created(
            new PromoResource($promo),
            'Promo created successfully'
        );
    }

    /**
     * PUT /api/admin/promos/{id}
     * Update promo
     */
    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $promo = Promo::with(['stores', 'products'])->find($id);

        if (!$promo) {
            return ApiResponse::notFound('Promo not found');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'banner' => 'nullable|image|max:2048',
            'description' => 'nullable|string',
            'discount_percentage' => 'sometimes|required|numeric|min:1|max:100',
            'min_order_value' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:Active,Non-active',
            'applies_to' => 'nullable|in:All,Specific',
            'applies_to_product' => 'nullable|in:All,Specific',

            'store_ids' => 'array',
            'store_ids.*' => 'integer|exists:stores,id',

            'product_ids' => 'array',
            'product_ids.*' => 'integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        $data = $validator->validated();

        $storeIds = $data['store_ids'] ?? null;
        $productIds = $data['product_ids'] ?? null;

        unset($data['store_ids'], $data['product_ids']);

        if ($request->hasFile('banner')) {
            // Delete old banner if exists
            if ($promo->banner) {
                Storage::disk('public')->delete($promo->banner);
            }
            $data['banner'] = $request->file('banner')->store('promos/banners', 'public');
        }

        $promo->update($data);

        if (!is_null($storeIds)) {
            $promo->stores()->sync($storeIds);
        }

        if (!is_null($productIds)) {
            $promo->products()->sync($productIds);
        }

        $promo->load(['stores', 'products']);

        // Log activity
        $this->logActivity('UPDATE', "Memperbarui promo: {$promo->name}");

        return ApiResponse::success(
            new PromoResource($promo),
            'Promo updated successfully'
        );
    }

    /**
     * DELETE /api/admin/promos/{id}
     * Hapus promo
     */
    public function destroy($id)
    {
        $this->ensureAdmin();

        $promo = Promo::find($id);

        if (!$promo) {
            return ApiResponse::notFound('Promo not found');
        }

        $promoName = $promo->name;

        $promo->stores()->detach();
        $promo->products()->detach();

        $promo->delete();

        // Log activity
        $this->logActivity('DELETE', "Menghapus promo: {$promoName}");

        return ApiResponse::success(null, 'Promo deleted successfully');
    }
}
