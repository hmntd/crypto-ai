<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiAnalysisCache extends Model
{
    use HasFactory;

    protected $fillable = [
        'cryptocurrency_id',
        'analysis',
        'expires_at',
    ];

    protected $casts = [
        'analysis' => 'array',
        'expires_at' => 'datetime',
    ];

    public function cryptocurrency(): BelongsTo
    {
        return $this->belongsTo(Cryptocurrency::class);
    }
}
