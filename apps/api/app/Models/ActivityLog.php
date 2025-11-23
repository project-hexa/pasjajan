<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
  use HasFactory;

  protected $table = 'activity_log';

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

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
