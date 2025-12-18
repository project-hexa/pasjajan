<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'activity_type',
        'description',
        'timestamp',
        'ip_address',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    protected $appends = ['timestamp_wib'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get timestamp in WIB timezone with formatted string
     */
    public function getTimestampWibAttribute(): string
    {
        return Carbon::parse($this->timestamp)
            ->timezone('Asia/Jakarta')
            ->format('Y-m-d H:i:s');
    }

    /**
     * Override timestamp accessor to always return WIB
     */
    protected function timestamp(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Carbon::parse($value)
                ->timezone('Asia/Jakarta')
                ->format('Y-m-d H:i:s')
        );
    }
}
