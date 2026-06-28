<?php

namespace App\Services\Shared;

use App\Models\Product;

class ProductSkuService
{
    /**
     * Generate the next unique SKU formatted as MH-PRD-000001.
     */
    public function generateNextSku(): string
    {
        $lastProduct = Product::withTrashed()
            ->where('sku', 'like', 'MH-PRD-%')
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;

        if ($lastProduct && preg_match('/MH-PRD-(\d+)/', $lastProduct->sku, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        }

        // Guarantee uniqueness in case of manually created or conflicting SKUs
        do {
            $sku = 'MH-PRD-' . str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
            $nextNumber++;
        } while (Product::withTrashed()->where('sku', $sku)->exists());

        return $sku;
    }
}
