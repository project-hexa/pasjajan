<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShipmentReview extends Model
{
  use HasFactory;

  protected $fillable = [
    'shipment_id',
    'rating',
    'comment',
    'review_date',
  ];

  protected $casts = [
    'rating' => 'integer',
    'review_date' => 'datetime',
  ];

  public function shipment(): BelongsTo
  {
    return $this->belongsTo(Shipment::class);
  }
}
