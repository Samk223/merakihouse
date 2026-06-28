<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreProductRequest;
use App\Http\Requests\Api\Admin\UpdateProductRequest;
use App\Http\Resources\Admin\ProductResource;
use App\Models\Product;
use App\Services\Admin\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of paginated products.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['category', 'featured', 'active', 'search', 'low_stock']);
        $perPage = (int) $request->input('per_page', 15);

        $products = $this->productService->paginateProducts($filters, $perPage);

        return ProductResource::collection($products)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());

        return (new ProductResource($product->load(['category', 'images'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): JsonResponse
    {
        $productWithRelations = $this->productService->getProduct($product);

        return (new ProductResource($productWithRelations))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Update the specified product.
     */
    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $updatedProduct = $this->productService->updateProduct($product, $request->validated());

        return (new ProductResource($updatedProduct->load(['category', 'images'])))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Soft delete the specified product.
     */
    public function destroy(Product $product): JsonResponse
    {
        $this->productService->deleteProduct($product);

        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully.',
        ], 200);
    }

    /**
     * Upload an image/file and return public path.
     */
    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'file' => ['required', 'file', 'image', 'max:5120'], // 5MB max limit
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $frontendPath = base_path('../frontend/public/home/products');
            $file->move($frontendPath, $filename);

            return response()->json([
                'success' => true,
                'path' => '/home/products/' . $filename,
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'No file uploaded.',
        ], 400);
    }
}
