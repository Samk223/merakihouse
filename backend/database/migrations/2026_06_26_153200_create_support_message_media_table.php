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
        Schema::create('support_message_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('support_message_id')
                ->constrained('support_messages')
                ->cascadeOnDelete();
            $table->string('path');
            $table->string('type');
            $table->string('mime_type')->nullable();
            $table->integer('display_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('support_message_media');
    }
};
