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
        Schema::table('categories', function (Blueprint $table) {
            $table->renameColumn('sort_order', 'display_order');
            $table->softDeletes();
        });

        Schema::table('category_media', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->renameColumn('display_order', 'sort_order');
        });

        Schema::table('category_media', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
