<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create support_tickets table
        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('ticket_number')->unique();
            $table->string('subject');
            $table->string('category');
            $table->string('priority');
            $table->string('status')->default('open');
            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });

        // 2. Modify existing support_messages table without dropping it
        Schema::table('support_messages', function (Blueprint $table) {
            $table->foreignId('ticket_id')
                ->nullable()
                ->constrained('support_tickets')
                ->cascadeOnDelete();
            $table->boolean('is_admin')->default(false);
            $table->softDeletes();
        });

        // 3. Migrate existing data from support_messages to support_tickets
        $messages = DB::table('support_messages')->get();
        foreach ($messages as $msg) {
            $ticketId = DB::table('support_tickets')->insertGetId([
                'user_id' => $msg->user_id ?? 1,
                'ticket_number' => 'MH-TKT-' . str_pad($msg->id, 6, '0', STR_PAD_LEFT),
                'subject' => $msg->subject ?? 'Support Inquiry',
                'category' => 'General',
                'priority' => 'low',
                'status' => $msg->status ?? 'open',
                'created_at' => $msg->created_at,
                'updated_at' => $msg->updated_at,
            ]);

            DB::table('support_messages')
                ->where('id', $msg->id)
                ->update(['ticket_id' => $ticketId]);
        }

        // 4. Drop columns that are no longer needed
        Schema::table('support_messages', function (Blueprint $table) {
            $table->dropColumn(['name', 'email', 'subject', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('support_messages', function (Blueprint $table) {
            $table->string('name')->nullable();
            $table->string('email')->nullable();
            $table->string('subject')->nullable();
            $table->string('status')->default('pending');
        });

        // Copy some data back if possible
        $messages = DB::table('support_messages')->get();
        foreach ($messages as $msg) {
            if ($msg->ticket_id) {
                $ticket = DB::table('support_tickets')->where('id', $msg->ticket_id)->first();
                if ($ticket) {
                    DB::table('support_messages')
                        ->where('id', $msg->id)
                        ->update([
                            'subject' => $ticket->subject,
                            'status' => $ticket->status,
                        ]);
                }
            }
        }

        Schema::table('support_messages', function (Blueprint $table) {
            $table->dropForeign(['ticket_id']);
            $table->dropColumn(['ticket_id', 'is_admin', 'deleted_at']);
        });

        Schema::dropIfExists('support_tickets');
    }
};
