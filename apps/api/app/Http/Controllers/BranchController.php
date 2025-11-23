<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Store;
use Illuminate\Validation\Rule;

class BranchController extends Controller
{

    public function index(Request $request)
    {
        $query = Store::query()->withCount('orders');

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }


        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $branches = $query->orderBy('name')->get();

        return response()->json([
            'data' => $branches->map(function ($store) {
                return [
                    'id' => $store->id,
                    'code' => $store->code,
                    'name' => $store->name,
                    'address' => $store->address,
                    'phone_number' => $store->phone_number,
                    'latitude' => (float) $store->latitude,
                    'longitude' => (float) $store->longitude,
                    'is_active' => $store->is_active,
                    'total_orders' => $store->orders_count,
                    'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
                ];
            }),
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:10|unique:stores,code',
            'name' => 'required|string|max:100',
            'address' => 'required|string',
            'phone_number' => 'required|string|max:15',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $validated['is_active'] = true;

        $store = Store::create($validated);

        return response()->json([
            'message' => 'Branch created successfully',
            'data' => [
                'id' => $store->id,
                'code' => $store->code,
                'name' => $store->name,
                'address' => $store->address,
                'phone_number' => $store->phone_number,
                'latitude' => (float) $store->latitude,
                'longitude' => (float) $store->longitude,
                'is_active' => $store->is_active,
                'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
            ],
        ], 201);
    }


    public function show($id)
    {
        $store = Store::withCount('orders')->findOrFail($id);

        return response()->json([
            'data' => [
                'id' => $store->id,
                'code' => $store->code,
                'name' => $store->name,
                'address' => $store->address,
                'phone_number' => $store->phone_number,
                'latitude' => (float) $store->latitude,
                'longitude' => (float) $store->longitude,
                'is_active' => $store->is_active,
                'total_orders' => $store->orders_count,
                'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }


    public function update(Request $request, $id)
    {
        $store = Store::findOrFail($id);

        $validated = $request->validate([
            'code' => ['sometimes', 'string', 'max:10', Rule::unique('stores', 'code')->ignore($store->id)],
            'name' => 'sometimes|string|max:100',
            'address' => 'sometimes|string',
            'phone_number' => 'sometimes|string|max:15',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $store->update($validated);

        return response()->json([
            'message' => 'Branch updated successfully',
            'data' => [
                'id' => $store->id,
                'code' => $store->code,
                'name' => $store->name,
                'address' => $store->address,
                'phone_number' => $store->phone_number,
                'latitude' => (float) $store->latitude,
                'longitude' => (float) $store->longitude,
                'is_active' => $store->is_active,
                'created_at' => $store->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $store->updated_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }


    public function deactivate($id)
    {
        $store = Store::findOrFail($id);

        if (!$store->is_active) {
            return response()->json([
                'message' => 'Branch is already inactive',
            ], 400);
        }

        $store->update(['is_active' => false]);

        return response()->json([
            'message' => 'Branch deactivated successfully',
            'data' => [
                'id' => $store->id,
                'code' => $store->code,
                'name' => $store->name,
                'is_active' => $store->is_active,
            ],
        ]);
    }


    public function activate($id)
    {
        $store = Store::findOrFail($id);

        if ($store->is_active) {
            return response()->json([
                'message' => 'Branch is already active',
            ], 400);
        }

        $store->update(['is_active' => true]);

        return response()->json([
            'message' => 'Branch activated successfully',
            'data' => [
                'id' => $store->id,
                'code' => $store->code,
                'name' => $store->name,
                'is_active' => $store->is_active,
            ],
        ]);
    }
}
