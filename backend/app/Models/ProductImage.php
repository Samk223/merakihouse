<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImage extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'product_id',
        'path',
        'image_url',
        'type',
        'mime_type',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $attributes = [
        'type' => 'image',
    ];

    protected $appends = [
        'image_url',
    ];

    /**
     * Maintain backward compatibility with image_url attribute.
     */
    public function getImageUrlAttribute(): ?string
    {
        return $this->path;
    }

    /**
     * Mutator to automatically map image_url to path.
     */
    public function setImageUrlAttribute(?string $value): void
    {
        $this->attributes['path'] = $value;
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
