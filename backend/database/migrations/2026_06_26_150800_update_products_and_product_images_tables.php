<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'brand')) {
                $table->string('brand')->nullable();
            }
            if (!Schema::hasColumn('products', 'discount_price')) {
                $table->decimal('discount_price', 10, 2)->nullable();
            }
            if (!Schema::hasColumn('products', 'low_stock_threshold')) {
                $table->integer('low_stock_threshold')->default(5);
            }
            if (!Schema::hasColumn('products', 'gst_percentage')) {
                $table->integer('gst_percentage')->default(18);
            }
            if (!Schema::hasColumn('products', 'weight')) {
                $table->decimal('weight', 8, 2)->nullable();
            }
            if (!Schema::hasColumn('products', 'dimensions')) {
                $table->string('dimensions')->nullable();
            }
            if (!Schema::hasColumn('products', 'featured')) {
                $table->boolean('featured')->default(false);
            }
            if (!Schema::hasColumn('products', 'meta_title')) {
                $table->string('meta_title')->nullable();
            }
            if (!Schema::hasColumn('products', 'meta_description')) {
                $table->text('meta_description')->nullable();
            }
            if (!Schema::hasColumn('products', 'deleted_at')) {
                $table->softDeletes();
            }
        });

        Schema::table('product_images', function (Blueprint $table) {
            if (!Schema::hasColumn('product_images', 'deleted_at')) {
                $table->softDeletes();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $columnsToDrop = [];
            foreach (['brand', 'discount_price', 'low_stock_threshold', 'gst_percentage', 'weight', 'dimensions', 'featured', 'meta_title', 'meta_description'] as $col) {
                if (Schema::hasColumn('products', $col)) {
                    $columnsToDrop[] = $col;
                }
            }
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
            if (Schema::hasColumn('products', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });

        Schema::table('product_images', function (Blueprint $table) {
            if (Schema::hasColumn('product_images', 'deleted_at')) {
                $table->dropSoftDeletes();
            }
        });
    }
};
