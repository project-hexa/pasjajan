<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoryPoint extends Model
{
  use HasFactory;

  protected $fillable = [
    'customer_id',
    'type',
    'notes',
    'total_point',
  ];

  protected $casts = [
    'type' => 'string',
    'total_point' => 'integer',
  ];

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }
}
