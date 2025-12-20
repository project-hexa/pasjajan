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

        // Process redemption in transaction
        DB::beginTransaction();
        try {
            // Deduct points
            $customer->point -= $voucher->required_points;
            $customer->save();

            // Create history point record
            \App\Models\HistoryPoint::create([
                'customer_id' => $customer->id,
                'type' => 'debit',
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
}
