<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Menampilkan keranjang belanja
     */
    public function index(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
        ]);

        $customerId = $request->customer_id;

        $carts = Cart::with(['product.productCategory', 'customer'])
            ->where('customer_id', $customerId)
            ->get();

        // Hitung total
        $total = 0;
        foreach ($carts as $cart) {
            $total += $cart->product->price * $cart->quantity;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'items' => $carts,
                'total' => $total,
                'items_count' => $carts->count(),
            ],
        ]);
    }

    /**
     * Menambahkan produk ke keranjang
     */
    public function add(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::find($request->product_id);

        // Check stock
        if ($product->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock. Available: ' . $product->stock,
            ], 400);
        }

        // Check if product already in cart
        $existingCart = Cart::where('customer_id', $request->customer_id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingCart) {
            // Update quantity
            $newQuantity = $existingCart->quantity + $request->quantity;

            if ($product->stock < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient stock. Available: ' . $product->stock,
                ], 400);
            }

            $existingCart->quantity = $newQuantity;
            $existingCart->save();

            $cart = $existingCart;
        } else {
            // Create new cart item
            $cart = new Cart();
            $cart->customer_id = $request->customer_id;
            $cart->product_id = $request->product_id;
            $cart->quantity = $request->quantity;
            $cart->added_at = now();
            $cart->save();
        }

        $cart->load(['product.productCategory', 'customer']);

        return response()->json([
            'success' => true,
            'message' => 'Product added to cart successfully',
            'data' => $cart,
        ], 201);
    }

    /**
     * Update quantity keranjang
     */
    public function update(Request $request, $cartId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::find($cartId);

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found',
            ], 404);
        }

        $cart->load('product');

        // Check stock
        if ($cart->product->stock < $request->quantity) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient stock. Available: ' . $cart->product->stock,
            ], 400);
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        $cart->load(['product.productCategory', 'customer']);

        return response()->json([
            'success' => true,
            'message' => 'Cart updated successfully',
            'data' => $cart,
        ]);
    }

    /**
     * Remove item from cart
     */
    public function remove($cartId)
    {
        $cart = Cart::find($cartId);

        if (!$cart) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found',
            ], 404);
        }

        $cart->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item removed from cart successfully',
        ]);
    }

    /**
     * Clear cart
     */
    public function clear(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
        ]);

        Cart::where('customer_id', $request->customer_id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cart cleared successfully',
        ]);
    }
}