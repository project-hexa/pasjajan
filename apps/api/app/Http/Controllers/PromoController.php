<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\PromoResource;
use App\Models\Promo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use App\Models\Store;
use App\Models\Product;

class PromoController extends Controller
{
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

        return PromoResource::collection($promos);
    }

    public function show($id, Request $request)
    {
        $promo = Promo::with(['products'])
            ->where('id', $id)
            ->active()
            ->firstOrFail();

        return new PromoResource($promo);
    }

    private function ensureAdmin()
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'Admin') {
            abort(response()->json([
                'message' => 'Forbidden. Only admin can manage promos.',
            ], 403));
        }
    }

    /**
     * GET /api/admin/promos
     * List semua promo (admin only)
     */
    public function index(Request $request)
    {
        // $this->ensureAdmin();

        $perPage = $request->query('per_page', 15);

        $promos = Promo::with(['stores', 'products'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return PromoResource::collection($promos);

    }

    public function listStores()
    {
        return response()->json(Store::select('id', 'name')->get());
    }

    public function listProducts()
    {
        return response()->json(Product::select('id', 'name')->get());
    }

    /**
     * POST /api/admin/promos
     * Tambah promo baru
     */
    public function store(Request $request)
    {
        // $this->ensureAdmin();

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
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
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

        return (new PromoResource($promo))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * PUT /api/admin/promos/{id}
     * Update promo
     */
    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $promo = Promo::with(['stores', 'products'])->findOrFail($id);

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
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ], 422);
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

        // kalau dikirim, baru di-sync
        if (!is_null($storeIds)) {
            $promo->stores()->sync($storeIds);
        }

        if (!is_null($productIds)) {
            $promo->products()->sync($productIds);
        }

        $promo->load(['stores', 'products']);

        return new PromoResource($promo);
    }

    /**
     * DELETE /api/admin/promos/{id}
     * Hapus promo
     */
    public function destroy($id)
    {
        $this->ensureAdmin();

        $promo = Promo::findOrFail($id);

        // hapus pivot dulu kalau mau rapi
        $promo->stores()->detach();
        $promo->products()->detach();

        $promo->delete();

        return response()->json([
            'message' => 'Promo deleted successfully',
        ]);
    }
}
