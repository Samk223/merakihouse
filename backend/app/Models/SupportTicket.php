<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupportTicket extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'ticket_number',
        'subject',
        'category',
        'priority',
        'status',
        'assigned_to',
        'resolved_at',
        'closed_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function supportMessages(): HasMany
    {
        return $this->hasMany(SupportMessage::class, 'ticket_id');
    }
}
