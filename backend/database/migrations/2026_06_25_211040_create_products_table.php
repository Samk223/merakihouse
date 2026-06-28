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
        Schema::create('products', function (Blueprint $table) {
    $table->id();

    // Category
    $table->foreignId('category_id')
          ->constrained()
          ->cascadeOnDelete();

    // Basic Information
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('sku')->unique();

    $table->string('short_description')->nullable();
    $table->longText('description')->nullable();

    // Pricing
    $table->decimal('price', 10, 2);
    $table->decimal('compare_price', 10, 2)->nullable();
    $table->decimal('cost_price', 10, 2)->nullable();

    // Inventory
    $table->integer('stock')->default(0);
    $table->boolean('track_inventory')->default(true);

    // Product Status
    $table->boolean('featured')->default(false);
    $table->boolean('best_seller')->default(false);
    $table->boolean('new_arrival')->default(false);
    $table->boolean('is_active')->default(true);

    // Basic SEO
    $table->string('meta_title')->nullable();
    $table->text('meta_description')->nullable();

    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
