<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'sku',
        'short_description',
        'description',
        'price',
        'discount_price',
        'compare_price',
        'cost_price',
        'stock',
        'low_stock_threshold',
        'gst_percentage',
        'track_inventory',
        'featured',
        'best_seller',
        'new_arrival',
        'is_active',
        'brand',
        'weight',
        'dimensions',
        'meta_title',
        'meta_description',
        'product_type',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'stock' => 'integer',
        'low_stock_threshold' => 'integer',
        'gst_percentage' => 'integer',
        'featured' => 'boolean',
        'is_active' => 'boolean',
        'track_inventory' => 'boolean',
        'weight' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }
}
