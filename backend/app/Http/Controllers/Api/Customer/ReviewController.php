<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\StoreReviewRequest;
use App\Http\Requests\Api\Customer\UpdateReviewRequest;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource's reviews with aggregates.
     */
    public function index(string $productIdentifier): JsonResponse
    {
        // Resolve product by ID or Slug
        $product = Product::where('id', $productIdentifier)
            ->orWhere('slug', $productIdentifier)
            ->first();

        if (! $product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found.',
            ], 404);
        }

        // Calculate average rating and total reviews using database aggregate functions
        $stats = Review::where('product_id', $product->id)
            ->selectRaw('COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as total_reviews')
            ->first();

        // Eager load review users to avoid N+1 queries
        $reviews = Review::where('product_id', $product->id)
            ->with('user:id,name')
            ->latest()
            ->get();

        // Format review data
        $formattedReviews = $reviews->map(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'review_date' => $review->created_at->toISOString(),
                'reviewer_name' => $review->user ? $review->user->name : 'Anonymous',
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Reviews retrieved successfully.',
            'data' => [
                'average_rating' => round((float) $stats->average_rating, 1),
                'total_reviews' => (int) $stats->total_reviews,
                'reviews' => $formattedReviews,
            ],
        ], 200);
    }

    /**
     * Store a newly created review in storage.
     */
    public function store(StoreReviewRequest $request): JsonResponse
    {
        $user = $request->user();
        $productId = $request->product_id;

        // Check if the user has a delivered order containing this product
        $hasPurchasedAndDelivered = Order::where('user_id', $user->id)
            ->where('status', 'Delivered')
            ->whereHas('orderItems', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();

        if (! $hasPurchasedAndDelivered) {
            return response()->json([
                'success' => false,
                'message' => 'You are not eligible to review this product.',
                'errors' => [
                    'product_id' => ['You can only review products you have purchased and that have been delivered.']
                ]
            ], 422);
        }

        // Prevent duplicate reviews for the same user and product
        $alreadyReviewed = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        if ($alreadyReviewed) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product.',
                'errors' => [
                    'product_id' => ['You can only review a product once.']
                ]
            ], 422);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $productId,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully.',
            'data' => $review,
        ], 201);
    }

    /**
     * Update the specified review in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review): JsonResponse
    {
        // Only review owner may update
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        // Allow updates only to rating and comment
        $review->update($request->only(['rating', 'comment']));

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully.',
            'data' => $review,
        ], 200);
    }

    /**
     * Remove the specified review from storage.
     */
    public function destroy(Request $request, Review $review): JsonResponse
    {
        // Only review owner may delete
        if ($review->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.',
        ], 200);
    }
}
