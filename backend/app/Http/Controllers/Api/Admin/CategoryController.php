<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\StoreCategoryRequest;
use App\Http\Requests\Api\Admin\UpdateCategoryRequest;
use App\Http\Resources\Admin\CategoryResource;
use App\Models\Category;
use App\Services\Admin\CategoryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected CategoryService $categoryService;

    public function __construct(CategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    /**
     * Display a listing of paginated categories.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $categories = $this->categoryService->paginateCategories($perPage);

        return CategoryResource::collection($categories)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created category.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        $category = $this->categoryService->createCategory($request->validated());

        return (new CategoryResource($category->load('media')))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category): JsonResponse
    {
        $categoryWithMedia = $this->categoryService->getCategory($category);

        return (new CategoryResource($categoryWithMedia))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        $updatedCategory = $this->categoryService->updateCategory($category, $request->validated());

        return (new CategoryResource($updatedCategory->load('media')))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Soft delete the specified category.
     */
    public function destroy(Category $category): JsonResponse
    {
        $this->categoryService->deleteCategory($category);

        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully.',
        ], 200);
    }
}
