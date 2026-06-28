<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupportMessage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'message',
        'is_admin',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
    ];

    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicket::class, 'ticket_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function media(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SupportMessageMedia::class, 'support_message_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($message) {
            $message->media()->delete();
        });
    }
}
