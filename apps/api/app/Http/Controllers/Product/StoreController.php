<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller{
    /**
     * Menampilkan detail produk di toko (termasuk stok di toko)
     */
    public function productDetail($storeId, $productId)
    {
        $store = Store::find($storeId);
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        $product = \App\Models\Product::with('productCategory')->find($productId);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        // Hitung stok produk di toko ini
        $stockInStore = \DB::table('stock_movements')
            ->where('product_id', $productId)
            ->where('store_id', $storeId)
            ->sum('quantity_change');
        $product->stock_in_store = $stockInStore;
        $product->available_in_store = $stockInStore > 0;

        return response()->json([
            'success' => true,
            'data' => [
                'store' => $store,
                'product' => $product,
            ],
        ]);
    }

    /**
     * Menampilkan produk yang tersedia di toko
     */
    public function products(Request $request, $storeId)
    {
        $store = Store::find($storeId);
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        // Ambil product_id yang stoknya > 0 di toko ini
        $productIds = \DB::table('stock_movements')
            ->select('product_id')
            ->where('store_id', $storeId)
            ->groupBy('product_id')
            ->havingRaw('SUM(quantity_change) > 0')
            ->pluck('product_id');

        $query = \App\Models\Product::with('productCategory')
            ->whereIn('id', $productIds);

        // Search by name
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter kategori
        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('product_category_id', $request->category_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        // Tambahkan info stok per toko ke setiap produk
        $products->getCollection()->transform(function ($product) use ($storeId) {
            $stockInStore = \DB::table('stock_movements')
                ->where('product_id', $product->id)
                ->where('store_id', $storeId)
                ->sum('quantity_change');
            $product->stock_in_store = $stockInStore;
            return $product;
        });

        return response()->json([
            'success' => true,
            'message' => 'Products in store retrieved successfully',
            'data' => [
                'store' => $store,
                'products' => $products,
            ],
        ]);
    }

    /**
     * Menampilkan daftar toko
     *Pencarian toko berdasarkan nama
     */
    public function index(Request $request)
    {
        $query = Store::query();

        // Filter hanya toko aktif
        $query->where('is_active', true);

        // Search by name
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 10);
        $stores = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Stores retrieved successfully',
            'data' => $stores,
        ]);
    }

    /**
     * Show store detail
     */
    public function show($id)
    {
        $store = Store::find($id);

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $store,
        ]);
    }
}