<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Traits\LogsActivity;

class StaffProductController extends Controller
{
    use LogsActivity;
    /**
     * Tambah produk ke toko (dengan stok awal)
     */
    public function addProductToStore(Request $request, $storeId)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'initial_stock' => 'required|integer|min:0',
        ]);

        $store = Store::find($storeId);
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        // Cek apakah sudah ada stock movement untuk produk ini di toko ini
        $exists = DB::table('stock_movements')
            ->where('store_id', $storeId)
            ->where('product_id', $request->product_id)
            ->exists();
        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Product already exists in this store',
            ], 400);
        }

        // Tambah stock movement awal
        DB::table('stock_movements')->insert([
            'store_id' => $storeId,
            'product_id' => $request->product_id,
            'quantity_change' => $request->initial_stock,
            'notes' => 'Initial stock by staff',
            'created_at' => now(),
            'updated_at' => now(),
        ]);


        $product = Product::find($request->product_id);

        // Log activity
        $this->logActivity('CREATE', "Menambahkan produk {$product->name} ke toko {$store->name} dengan stok awal {$request->initial_stock}");

        return response()->json([
            'success' => true,
            'message' => 'Product added to store with initial stock',
        ], 201);
    }

    /**
     * Hapus produk dari toko (menghapus semua stock movement produk di toko ini)
     */
    public function removeProductFromStore(Request $request, $storeId, $productId)
    {
        $store = Store::find($storeId);
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        // Get product info for logging before deletion
        $product = Product::find($productId);

        // Hapus semua stock movement produk ini di toko ini
        DB::table('stock_movements')
            ->where('store_id', $storeId)
            ->where('product_id', $productId)
            ->delete();

        // Log activity
        if ($product) {
            $this->logActivity('DELETE', "Menghapus produk {$product->name} dari toko {$store->name}");
        }

        return response()->json([
            'success' => true,
            'message' => 'Product removed from store',
        ]);
    }

    /**
     * Tambah/kurangi stok produk di toko
     */
    public function adjustStock(Request $request, $storeId, $productId)
    {
        $request->validate([
            'quantity_change' => 'required|integer',
            'notes' => 'nullable|string',
        ]);

        $store = Store::find($storeId);
        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        $product = Product::find($productId);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        // Tambah stock movement baru
        DB::table('stock_movements')->insert([
            'store_id' => $storeId,
            'product_id' => $productId,
            'quantity_change' => $request->quantity_change,
            'notes' => $request->notes ?? 'Stock adjustment by staff',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Log activity
        $changeType = $request->quantity_change > 0 ? 'menambah' : 'mengurangi';
        $absChange = abs($request->quantity_change);
        $this->logActivity('UPDATE', "Menyesuaikan stok produk {$product->name} di toko {$store->name}: {$changeType} {$absChange} unit");

        return response()->json([
            'success' => true,
            'message' => 'Stock adjusted successfully',
        ]);
    }
    /**
     * FR-02-03: Get products available in a specific store
     * 
     * Menampilkan daftar produk yang tersedia di toko yang dipilih
     * berdasarkan stock movements
     */
    public function index(Request $request, $storeId)
    {
        // Validasi store exists
        $store = Store::find($storeId);

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        // Get products dengan stok > 0 di toko ini
        // Menggunakan raw query karena tidak bisa ubah Model
        $productIds = DB::table('stock_movements')
            ->select('product_id')
            ->where('store_id', $storeId)
            ->groupBy('product_id')
            ->havingRaw('SUM(quantity_change) > 0')
            ->pluck('product_id');

        if ($productIds->isEmpty()) {
            return response()->json([
                'success' => true,
                'message' => 'No products available in this store',
                'data' => [
                    'store' => $store,
                    'products' => [
                        'data' => [],
                        'total' => 0
                    ],
                ],
            ]);
        }

        // Query products berdasarkan product_ids
        $query = Product::with('productCategory')
            ->whereIn('id', $productIds);

        // Search by name
        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Filter by category
        if ($request->has('category_id') && $request->category_id != '') {
            $query->where('product_category_id', $request->category_id);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        // Tambahkan info stok per toko ke setiap produk (tanpa ubah Model)
        $products->getCollection()->transform(function ($product) use ($storeId) {
            // Hitung stok di toko ini menggunakan raw query
            $stockInStore = DB::table('stock_movements')
                ->where('product_id', $product->id)
                ->where('store_id', $storeId)
                ->sum('quantity_change');

            $product->stock_in_store = $stockInStore;
            return $product;
        });

        return response()->json([
            'success' => true,
            'message' => 'Products retrieved successfully',
            'data' => [
                'store' => $store,
                'products' => $products,
            ],
        ]);
    }

    /**
     * Get product detail with stock info in specific store
     */
    public function show($storeId, $productId)
    {
        // Validasi store exists
        $store = Store::find($storeId);

        if (!$store) {
            return response()->json([
                'success' => false,
                'message' => 'Store not found',
            ], 404);
        }

        // Get product
        $product = Product::with('productCategory')->find($productId);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found',
            ], 404);
        }

        // Get stock di toko ini menggunakan raw query
        $stockInStore = DB::table('stock_movements')
            ->where('product_id', $productId)
            ->where('store_id', $storeId)
            ->sum('quantity_change');

        // Tambahkan info stok per toko (tanpa ubah Model)
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
     * Get stock movement history for a product in a store
     */
    public function stockHistory($storeId, $productId)
    {
        // Validasi
        $store = Store::find($storeId);
        $product = Product::find($productId);

        if (!$store || !$product) {
            return response()->json([
                'success' => false,
                'message' => 'Store or Product not found',
            ], 404);
        }

        // Get movements menggunakan raw query + pagination manual
        $perPage = request()->get('per_page', 20);
        $page = request()->get('page', 1);

        $movements = DB::table('stock_movements')
            ->where('store_id', $storeId)
            ->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        // Hitung current stock
        $currentStock = DB::table('stock_movements')
            ->where('product_id', $productId)
            ->where('store_id', $storeId)
            ->sum('quantity_change');

        return response()->json([
            'success' => true,
            'data' => [
                'store' => $store,
                'product' => $product,
                'current_stock' => $currentStock,
                'movements' => $movements,
            ],
        ]);
    }
}
