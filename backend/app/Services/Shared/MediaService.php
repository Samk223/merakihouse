<?php

namespace App\Services\Shared;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Validation\ValidationException;

class MediaService
{
    public function syncMedia(Model $parent, string $relationName, array $mediaPayload): void
    {
        $relation = $parent->{$relationName}();
        $relatedModelClass = $relation->getRelated();
        $dummy = new $relatedModelClass();
        $fillable = $dummy->getFillable();

        if (in_array('is_primary', $fillable)) {
            $this->validatePrimaryMedia($mediaPayload);
        }

        $existingMediaIds = [];
        $foreignKey = $relation->getForeignKeyName();

        foreach ($mediaPayload as $item) {
            if (isset($item['id'])) {
                // Update existing
                $media = $relatedModelClass::findOrFail($item['id']);

                // Ensure it belongs to the parent
                if ($media->{$foreignKey} !== $parent->getKey()) {
                    throw ValidationException::withMessages([
                        $relationName => ["Media item ID {$item['id']} does not belong to this parent record."]
                    ]);
                }

                $fillData = [
                    'type' => $item['type'],
                    'path' => $item['path'],
                    'mime_type' => $item['mime_type'] ?? $media->mime_type,
                ];

                if (in_array('alt_text', $fillable)) {
                    $fillData['alt_text'] = $item['alt_text'] ?? $media->alt_text;
                }

                if (in_array('sort_order', $fillable)) {
                    $fillData['sort_order'] = $item['sort_order'] ?? $media->sort_order;
                }

                if (in_array('display_order', $fillable)) {
                    $fillData['display_order'] = $item['display_order'] ?? ($item['sort_order'] ?? $media->display_order);
                }

                if (in_array('is_primary', $fillable)) {
                    $fillData['is_primary'] = $item['is_primary'] ?? $media->is_primary;
                }

                $media->update($fillData);
                $existingMediaIds[] = $media->id;
            } else {
                // Create new
                $fillData = [
                    'type' => $item['type'],
                    'path' => $item['path'],
                    'mime_type' => $item['mime_type'] ?? null,
                ];

                if (in_array('alt_text', $fillable)) {
                    $fillData['alt_text'] = $item['alt_text'] ?? null;
                }

                if (in_array('sort_order', $fillable)) {
                    $fillData['sort_order'] = $item['sort_order'] ?? 0;
                }

                if (in_array('display_order', $fillable)) {
                    $fillData['display_order'] = $item['display_order'] ?? ($item['sort_order'] ?? 0);
                }

                if (in_array('is_primary', $fillable)) {
                    $fillData['is_primary'] = $item['is_primary'] ?? false;
                }

                $newMedia = $relation->create($fillData);
                $existingMediaIds[] = $newMedia->id;
            }
        }

        // Soft delete or delete omitted media records
        $relation->whereNotIn('id', $existingMediaIds)->delete();
    }

    /**
     * Validate that at most one primary media exists in the payload.
     */
    public function validatePrimaryMedia(array $mediaItems): void
    {
        $primaryCount = 0;
        foreach ($mediaItems as $item) {
            if (isset($item['is_primary']) && (bool) $item['is_primary']) {
                $primaryCount++;
            }
        }

        if ($primaryCount > 1) {
            throw ValidationException::withMessages([
                'media' => ['Only one media item may be marked as primary.']
            ]);
        }
    }
}
