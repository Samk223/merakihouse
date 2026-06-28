<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;

use Illuminate\Database\Eloquent\SoftDeletes;

class CategoryMedia extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'category_id',
        'type',
        'path',
        'mime_type',
        'alt_text',
        'sort_order',
        'is_primary',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
