<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SupportMessageMedia extends Model
{
    use SoftDeletes;

    protected $table = 'support_message_media';

    protected $fillable = [
        'support_message_id',
        'path',
        'type',
        'mime_type',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
    ];

    public function supportMessage(): BelongsTo
    {
        return $this->belongsTo(SupportMessage::class, 'support_message_id');
    }
}
