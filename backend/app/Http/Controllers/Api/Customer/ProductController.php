<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of products with filtering, search, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['category', 'images'])
            ->where('is_active', true);

        // Search by keyword in name, description, and short_description
        if ($request->has('search') && ! empty($request->input('search'))) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                // Determine driver for PostgreSQL compatibility (case-insensitive ILIKE vs LIKE)
                $driver = $q->getConnection()->getDriverName();
                $operator = ($driver === 'pgsql') ? 'ilike' : 'like';

                $q->where('name', $operator, "%{$search}%")
                  ->orWhere('description', $operator, "%{$search}%")
                  ->orWhere('short_description', $operator, "%{$search}%");
            });
        }

        // Category Filter
        if ($request->has('category') && ! empty($request->input('category'))) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Price Filters
        if ($request->has('min_price') && is_numeric($request->input('min_price'))) {
            $query->where('price', '>=', (float) $request->input('min_price'));
        }

        if ($request->has('max_price') && is_numeric($request->input('max_price'))) {
            $query->where('price', '<=', (float) $request->input('max_price'));
        }

        // Paginate results
        $perPage = $request->input('per_page', 15);
        $products = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'message' => 'Products retrieved successfully.',
            'data' => $products,
        ], 200);
    }

    /**
     * Display the specified product by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $product = Product::where('slug', $slug)
            ->with(['category', 'images'])
            ->where('is_active', true)
            ->first();

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }

        $user = auth('sanctum')->user();
        $isWishlisted = false;
        if ($user) {
            $isWishlisted = \App\Models\Wishlist::where('user_id', $user->id)
                ->where('product_id', $product->id)
                ->exists();
        }

        $productData = array_merge($product->toArray(), ['is_wishlisted' => $isWishlisted]);

        return response()->json([
            'success' => true,
            'message' => 'Product retrieved successfully.',
            'data' => $productData,
        ], 200);
    }
}
