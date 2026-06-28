<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\AddCartItemRequest;
use App\Http\Requests\Api\Customer\UpdateCartItemRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display the authenticated user's cart.
     */
    public function index(Request $request): JsonResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();

        return $this->formatCartResponse($cart, 'Cart retrieved successfully.');
    }

    /**
     * Add a product to the user's cart (with lazy cart creation and stock checks).
     */
    public function store(AddCartItemRequest $request): JsonResponse
    {
        $product = Product::findOrFail($request->product_id);
        $quantityToAdd = $request->input('quantity', 1);

        // 1. Lazily create cart for the user
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        // 2. Check if product already exists in cart to prevent duplicates
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantityToAdd;

            // 3. Stock validation
            if ($product->track_inventory && $newQuantity > $product->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'The requested quantity exceeds the available stock.',
                    'errors' => [
                        'quantity' => ["Only {$product->stock} units are available in stock. You already have {$cartItem->quantity} in your cart."]
                    ]
                ], 422);
            }

            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $newQuantity = $quantityToAdd;

            // 3. Stock validation
            if ($product->track_inventory && $newQuantity > $product->stock) {
                return response()->json([
                    'success' => false,
                    'message' => 'The requested quantity exceeds the available stock.',
                    'errors' => [
                        'quantity' => ["Only {$product->stock} units are available in stock."]
                    ]
                ], 422);
            }

            $cart->cartItems()->create([
                'product_id' => $product->id,
                'quantity' => $newQuantity,
            ]);
        }

        return $this->formatCartResponse($cart, 'Product added to cart successfully.', 201);
    }

    /**
     * Update the quantity of an existing cart item.
     */
    public function update(UpdateCartItemRequest $request, int $cartItemId): JsonResponse
    {
        $cartItem = CartItem::find($cartItemId);

        if (! $cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        // 1. Owner check
        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $product = $cartItem->product;
        $newQuantity = $request->quantity;

        // 2. Stock validation
        if ($product->track_inventory && $newQuantity > $product->stock) {
            return response()->json([
                'success' => false,
                'message' => 'The requested quantity exceeds the available stock.',
                'errors' => [
                    'quantity' => ["Only {$product->stock} units are available in stock."]
                ]
            ], 422);
        }

        $cartItem->update(['quantity' => $newQuantity]);

        return $this->formatCartResponse($cartItem->cart, 'Cart item updated successfully.');
    }

    /**
     * Remove a cart item.
     */
    public function destroy(Request $request, int $cartItemId): JsonResponse
    {
        $cartItem = CartItem::find($cartItemId);

        if (! $cartItem) {
            return response()->json([
                'success' => false,
                'message' => 'Cart item not found.',
            ], 404);
        }

        // 1. Owner check
        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $cart = $cartItem->cart;
        $cartItem->delete();

        return $this->formatCartResponse($cart, 'Cart item removed successfully.');
    }

    /**
     * Helper to calculate subtotals, shipping, and format a standardized JSON response.
     */
    private function formatCartResponse(?Cart $cart, string $message, int $statusCode = 200): JsonResponse
    {
        if (! $cart) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'cart_items' => [],
                    'subtotal' => '0.00',
                    'shipping' => '0.00',
                    'total' => '0.00',
                ]
            ], $statusCode);
        }

        $cartItems = $cart->cartItems()
            ->with('product.images')
            ->get();

        $subtotal = 0.00;
        $formattedItems = [];

        foreach ($cartItems as $item) {
            $itemSubtotal = (float) ($item->product->price * $item->quantity);
            $subtotal += $itemSubtotal;

            $formattedItems[] = [
                'id' => $item->id,
                'cart_id' => $item->cart_id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'created_at' => $item->created_at,
                'updated_at' => $item->updated_at,
                'subtotal' => number_format($itemSubtotal, 2, '.', ''),
                'product' => $item->product,
            ];
        }

        // Shipping: $15.00 flat rate if subtotal > 0. Free shipping above $150.00.
        $shipping = 0.00;
        if ($subtotal > 0) {
            $shipping = ($subtotal >= 150.00) ? 0.00 : 15.00;
        }

        $total = $subtotal + $shipping;

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'cart_items' => $formattedItems,
                'subtotal' => number_format($subtotal, 2, '.', ''),
                'shipping' => number_format($shipping, 2, '.', ''),
                'total' => number_format($total, 2, '.', ''),
            ]
        ], $statusCode);
    }
}
