<?php

namespace App\Services\Admin;

use App\Models\Category;
use App\Services\Shared\SlugService;
use App\Services\Shared\MediaService;
use Illuminate\Support\Facades\DB;

class CategoryService
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }

    /**
     * Retrieve paginated categories sorted by display_order then name, including media.
     */
    public function paginateCategories(int $perPage = 15)
    {
        return Category::with(['media' => function ($query) {
                $query->orderBy('sort_order', 'asc');
            }])
            ->orderBy('display_order', 'asc')
            ->orderBy('name', 'asc')
            ->paginate($perPage);
    }

    /**
     * Retrieve details of a single category with its media.
     */
    public function getCategory(Category $category): Category
    {
        return $category->load(['media' => function ($query) {
            $query->orderBy('sort_order', 'asc');
        }]);
    }

    /**
     * Create a category with its media in a transaction.
     */
    public function createCategory(array $data): Category
    {
        if (isset($data['media']) && is_array($data['media'])) {
            $this->mediaService->validatePrimaryMedia($data['media']);
        }

        return DB::transaction(function () use ($data) {
            $category = Category::create([
                'name' => $data['name'],
                'slug' => SlugService::generate(Category::class, $data['name']),
                'description' => $data['description'] ?? null,
                'display_order' => $data['display_order'] ?? 0,
                'is_active' => $data['is_active'] ?? true,
            ]);

            if (isset($data['media']) && is_array($data['media'])) {
                $this->mediaService->syncMedia($category, 'media', $data['media']);
            }

            return $category;
        });
    }

    /**
     * Update a category and sync its media in a transaction.
     */
    public function updateCategory(Category $category, array $data): Category
    {
        $categoryData = [];
        if (isset($data['name'])) {
            $categoryData['name'] = $data['name'];
            if ($data['name'] !== $category->name) {
                $categoryData['slug'] = SlugService::generate(Category::class, $data['name'], $category->id);
            }
        }
        if (array_key_exists('description', $data)) {
            $categoryData['description'] = $data['description'];
        }
        if (isset($data['display_order'])) {
            $categoryData['display_order'] = $data['display_order'];
        }
        if (isset($data['is_active'])) {
            $categoryData['is_active'] = $data['is_active'];
        }

        return DB::transaction(function () use ($category, $categoryData, $data) {
            $category->update($categoryData);

            if (isset($data['media']) && is_array($data['media'])) {
                $this->mediaService->syncMedia($category, 'media', $data['media']);
            }

            return $category;
        });
    }

    /**
     * Soft delete a category and its associated media in a transaction.
     */
    public function deleteCategory(Category $category): void
    {
        DB::transaction(function () use ($category) {
            $category->delete();
            $category->media()->delete();
        });
    }
}
