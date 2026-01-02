<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Http\Resources\CustomerVoucherResource;
use App\Http\Resources\VoucherResource;
use App\Models\CustomerVoucher;
use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class VoucherController extends Controller
{
    /**
     * GET /api/customer/points
     * Get customer's current points balance
     */
    public function getCustomerPoints(Request $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        if (!$customer) {
            return ApiResponse::notFound('Customer not found');
        }

        return ApiResponse::success([
            'points' => $customer->point,
        ], 'Customer points retrieved successfully');
    }

    /**
     * GET /api/customer/vouchers
     * Get customer's redeemed vouchers
     */
    public function getCustomerVouchers(Request $request)
    {
        $user = $request->user();
        $customer = $user->customer;

        if (!$customer) {
            return ApiResponse::notFound('Customer not found');
        }

        $vouchers = CustomerVoucher::with('voucher')
            ->where('customer_id', $customer->id)
            ->orderBy('redeemed_at', 'desc')
            ->get();

        return ApiResponse::success(
            CustomerVoucherResource::collection($vouchers),
            'Customer vouchers retrieved successfully'
        );
    }

    /**
     * GET /api/vouchers/available
     * Get list of vouchers available for redemption
     */
    public function getAvailableVouchers(Request $request)
    {
        $vouchers = Voucher::available()
            ->orderBy('required_points', 'asc')
            ->get();

        return ApiResponse::success(
            VoucherResource::collection($vouchers),
            'Available vouchers retrieved successfully'
        );
    }

    /**
     * POST /api/customer/vouchers/redeem
     * Redeem a voucher using points
     */
    public function redeemVoucher(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'voucher_id' => 'required|integer|exists:vouchers,id',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        $user = $request->user();
        $customer = $user->customer;

        if (!$customer) {
            return ApiResponse::notFound('Customer not found');
        }

        $voucher = Voucher::available()->find($request->voucher_id);

        if (!$voucher) {
            return ApiResponse::error('Voucher not available or expired', 400);
        }

        // Check if customer has enough points
        if ($customer->point < $voucher->required_points) {
            return ApiResponse::error(
                'Insufficient points. Required: ' . $voucher->required_points . ', Available: ' . $customer->point,
                400
            );
        }

        // Check if customer already has this voucher (unused)
        $existingVoucher = CustomerVoucher::where('customer_id', $customer->id)
            ->where('voucher_id', $voucher->id)
            ->where('is_used', false)
            ->first();

        if ($existingVoucher) {
            return ApiResponse::error('You already have this voucher', 400);
        }

        // Check if voucher is being used in a pending order
        $inPendingOrder = \App\Models\Order::where('customer_id', $customer->id)
            ->where('voucher_id', $voucher->id)
            ->whereIn('payment_status', ['pending', 'unpaid'])
            ->where('status', 'pending')
            ->exists();

        if ($inPendingOrder) {
            return ApiResponse::error('Voucher ini sedang digunakan di order yang belum dibayar', 400);
        }

        // Process redemption in transaction
        DB::beginTransaction();
        try {
            // Deduct points
            $customer->point -= $voucher->required_points;
            $customer->save();

            // Create history point record
            \App\Models\HistoryPoint::create([
                'customer_id' => $customer->id,
                'type' => 'Keluar',
                'notes' => 'Redeem voucher: ' . $voucher->name,
                'total_point' => $voucher->required_points,
            ]);

            // Create customer voucher
            $customerVoucher = CustomerVoucher::create([
                'customer_id' => $customer->id,
                'voucher_id' => $voucher->id,
                'redeemed_at' => now(),
                'is_used' => false,
                'used_at' => null,
            ]);

            $customerVoucher->load('voucher');

            DB::commit();

            return ApiResponse::success([
                'voucher' => new CustomerVoucherResource($customerVoucher),
                'remaining_points' => $customer->point,
            ], 'Voucher redeemed successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return ApiResponse::serverError('Failed to redeem voucher: ' . $e->getMessage());
        }
    }

    // ==================== ADMIN CRUD METHODS ====================

    /**
     * Ensure authenticated user is admin
     */
    private function ensureAdmin()
    {
        $user = \Illuminate\Support\Facades\Auth::user();

        if (!$user || $user->role !== 'Admin') {
            abort(response()->json([
                'success' => false,
                'message' => 'Forbidden. Only admin can manage vouchers.'
            ], 403));
        }
    }

    /**
     * GET /api/admin/vouchers
     * List all vouchers (admin only)
     */
    public function index(Request $request)
    {
        $this->ensureAdmin();

        $perPage = $request->query('per_page', 15);
        $search = $request->query('search');
        $status = $request->query('status'); // active, inactive, all

        $query = Voucher::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        $vouchers = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return ApiResponse::success([
            'data' => VoucherResource::collection($vouchers),
            'meta' => [
                'current_page' => $vouchers->currentPage(),
                'per_page' => $vouchers->perPage(),
                'total' => $vouchers->total(),
                'last_page' => $vouchers->lastPage(),
            ]
        ], 'Vouchers retrieved successfully');
    }

    /**
     * GET /api/admin/vouchers/{id}
     * Get voucher detail (admin only)
     */
    public function show($id)
    {
        $this->ensureAdmin();

        $voucher = Voucher::find($id);

        if (!$voucher) {
            return ApiResponse::notFound('Voucher not found');
        }

        return ApiResponse::success(
            new VoucherResource($voucher),
            'Voucher retrieved successfully'
        );
    }

    /**
     * POST /api/admin/vouchers
     * Create new voucher (admin only)
     */
    public function store(Request $request)
    {
        $this->ensureAdmin();

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|min:6|max:9|unique:vouchers,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'discount_value' => 'required|numeric|min:0',
            'required_points' => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        $data = $validator->validated();
        $data['created_by'] = \Illuminate\Support\Facades\Auth::id();

        $voucher = Voucher::create($data);

        return ApiResponse::created(
            new VoucherResource($voucher),
            'Voucher created successfully'
        );
    }

    /**
     * PUT /api/admin/vouchers/{id}
     * Update voucher (admin only)
     */
    public function update(Request $request, $id)
    {
        $this->ensureAdmin();

        $voucher = Voucher::find($id);

        if (!$voucher) {
            return ApiResponse::notFound('Voucher not found');
        }

        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|required|string|min:6|max:9|unique:vouchers,code,' . $id,
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'discount_value' => 'sometimes|required|numeric|min:0',
            'required_points' => 'sometimes|required|integer|min:1',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        $voucher->update($validator->validated());

        return ApiResponse::success(
            new VoucherResource($voucher),
            'Voucher updated successfully'
        );
    }

    /**
     * DELETE /api/admin/vouchers/{id}
     * Delete voucher (admin only)
     */
    public function destroy($id)
    {
        $this->ensureAdmin();

        $voucher = Voucher::find($id);

        if (!$voucher) {
            return ApiResponse::notFound('Voucher not found');
        }

        // Check if voucher has been redeemed
        $redeemedCount = CustomerVoucher::where('voucher_id', $id)->count();

        if ($redeemedCount > 0) {
            return ApiResponse::error(
                "Cannot delete voucher. It has been redeemed by {$redeemedCount} customer(s).",
                400
            );
        }

        $voucher->delete();

        return ApiResponse::success(null, 'Voucher deleted successfully');
    }
}
