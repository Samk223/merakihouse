<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Services\Shared\MediaService;
use App\Services\Shared\ProductSkuService;
use App\Services\Shared\SlugService;
use Illuminate\Support\Facades\DB;

class ProductService
{
    protected MediaService $mediaService;
    protected ProductSkuService $skuService;

    public function __construct(MediaService $mediaService, ProductSkuService $skuService)
    {
        $this->mediaService = $mediaService;
        $this->skuService = $skuService;
    }

    /**
     * Retrieve paginated products with category and primary media, filtered and sorted.
     */
    public function paginateProducts(array $filters = [], int $perPage = 15)
    {
        $query = Product::with(['category', 'images' => function ($q) {
            $q->orderBy('is_primary', 'desc')->orderBy('sort_order', 'asc');
        }]);

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (isset($filters['featured'])) {
            $query->where('featured', filter_var($filters['featured'], FILTER_VALIDATE_BOOLEAN));
        }

        if (isset($filters['active'])) {
            $query->where('is_active', filter_var($filters['active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if (isset($filters['low_stock']) && filter_var($filters['low_stock'], FILTER_VALIDATE_BOOLEAN)) {
            $query->whereRaw('stock <= low_stock_threshold');
        }

        return $query->orderBy('id', 'desc')->paginate($perPage);
    }

    /**
     * Retrieve details of a single product with its category and all media.
     */
    public function getProduct(Product $product): Product
    {
        return $product->load(['category', 'images' => function ($q) {
            $q->orderBy('is_primary', 'desc')->orderBy('sort_order', 'asc');
        }]);
    }

    /**
     * Create a new product and sync its media within a transaction.
     */
    public function createProduct(array $data): Product
    {
        if (isset($data['media']) && is_array($data['media'])) {
            $this->mediaService->validatePrimaryMedia($data['media']);
        }

        return DB::transaction(function () use ($data) {
            $sku = $this->skuService->generateNextSku();
            $slug = SlugService::generate(Product::class, $data['name']);

            $product = Product::create([
                'category_id' => $data['category_id'],
                'name' => $data['name'],
                'slug' => $slug,
                'sku' => $sku,
                'description' => $data['description'],
                'short_description' => $data['short_description'] ?? null,
                'brand' => $data['brand'] ?? 'Meraki House',
                'price' => $data['price'],
                'discount_price' => $data['discount_price'] ?? null,
                'gst_percentage' => $data['gst_percentage'] ?? 18,
                'stock' => $data['stock'],
                'low_stock_threshold' => $data['low_stock_threshold'] ?? 5,
                'featured' => $data['is_featured'] ?? ($data['featured'] ?? false),
                'best_seller' => $data['is_best_seller'] ?? ($data['best_seller'] ?? false),
                'new_arrival' => $data['is_new_arrival'] ?? ($data['new_arrival'] ?? false),
                'is_active' => $data['is_active'] ?? true,
                'weight' => $data['weight'] ?? null,
                'dimensions' => $data['dimensions'] ?? null,
                'meta_title' => $data['meta_title'] ?? null,
                'meta_description' => $data['meta_description'] ?? null,
                'product_type' => $data['product_type'] ?? 'simple',
            ]);

            if (isset($data['media']) && is_array($data['media'])) {
                $this->mediaService->syncMedia($product, 'images', $data['media']);
            }

            return $product;
        });
    }

    /**
     * Update an existing product and sync its media within a transaction.
     */
    public function updateProduct(Product $product, array $data): Product
    {
        if (isset($data['media']) && is_array($data['media'])) {
            $this->mediaService->validatePrimaryMedia($data['media']);
        }

        return DB::transaction(function () use ($product, $data) {
            $productData = [];

            if (isset($data['name'])) {
                $productData['name'] = $data['name'];
                if ($data['name'] !== $product->name) {
                    $productData['slug'] = SlugService::generate(Product::class, $data['name'], $product->id);
                }
            }

            foreach ([
                'category_id',
                'name',
                'slug',
                'sku',
                'short_description',
                'description',
                'price',
                'discount_price',
                'gst_percentage',
                'stock',
                'low_stock_threshold',
                'featured',
                'best_seller',
                'new_arrival',
                'is_active',
                'weight',
                'dimensions',
                'meta_title',
                'meta_description',
                'product_type'
            ] as $field) {
                if (array_key_exists($field, $data)) {
                    $productData[$field] = $data[$field];
                }
            }

            if (array_key_exists('is_featured', $data)) {
                $productData['featured'] = $data['is_featured'];
            }
            if (array_key_exists('is_best_seller', $data)) {
                $productData['best_seller'] = $data['is_best_seller'];
            }
            if (array_key_exists('is_new_arrival', $data)) {
                $productData['new_arrival'] = $data['is_new_arrival'];
            }

            $product->update($productData);

            if (isset($data['media']) && is_array($data['media'])) {
                $this->mediaService->syncMedia($product, 'images', $data['media']);
            }

            return $product;
        });
    }

    /**
     * Soft delete a product and its associated media.
     */
    public function deleteProduct(Product $product): void
    {
        DB::transaction(function () use ($product) {
            $product->delete();
            $product->images()->delete();
        });
    }
}
