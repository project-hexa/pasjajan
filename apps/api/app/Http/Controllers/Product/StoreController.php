<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
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