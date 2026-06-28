<?php

namespace App\Services\Shared;

use Illuminate\Support\Str;

class SlugService
{
    /**
     * Generate a unique slug for a given Eloquent model class.
     */
    public static function generate(string $modelClass, string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 2;

        // Check if the model has a SoftDeletes trait (has withTrashed method)
        $hasSoftDeletes = method_exists($modelClass, 'withTrashed');

        while (self::querySlugExists($modelClass, $slug, $ignoreId, $hasSoftDeletes)) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    /**
     * Check if the slug exists in the database for the given model.
     */
    protected static function querySlugExists(string $modelClass, string $slug, ?int $ignoreId, bool $hasSoftDeletes): bool
    {
        $query = $modelClass::query();

        if ($hasSoftDeletes) {
            $query->withTrashed();
        }

        return $query->where('slug', $slug)
            ->when($ignoreId, function ($q) use ($ignoreId) {
                $q->where('id', '!=', $ignoreId);
            })
            ->exists();
    }
}
