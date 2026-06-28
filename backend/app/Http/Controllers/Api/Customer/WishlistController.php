<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StoreWishlistRequest;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Display a listing of the user's wishlist, eager loading the products.
     */
    public function index(Request $request): JsonResponse
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->with('product.images')
            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Wishlist retrieved successfully.',
            'data' => $wishlist,
        ], 200);
    }

    /**
     * Store a newly created resource in storage (Add product to wishlist).
     */
    public function store(StoreWishlistRequest $request): JsonResponse
    {
        $wishlist = Wishlist::firstOrCreate([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        // Eager load the product details for the response
        $wishlist->load('product.images');

        return response()->json([
            'success' => true,
            'message' => 'Product added to wishlist successfully.',
            'data' => $wishlist,
        ], 201);
    }

    /**
     * Remove the specified resource from storage (Remove product from wishlist).
     */
    public function destroy(Request $request, int $productId): JsonResponse
    {
        $wishlistItem = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();

        if (! $wishlistItem) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found in your wishlist.',
            ], 404);
        }

        $wishlistItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product removed from wishlist successfully.',
        ], 200);
    }
}
