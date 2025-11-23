<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Shipment extends Model
{
  use HasFactory;

  protected $fillable = [
    'order_id',
    'method_id',
    'staff_id',
    'completion_status',
    'cost',
  ];

  protected $casts = [
    'cost' => 'decimal:2',
  ];

  public function order(): BelongsTo
  {
    return $this->belongsTo(Order::class);
  }

  public function shipmentMethod(): BelongsTo
  {
    return $this->belongsTo(ShipmentMethod::class, 'method_id');
  }

  public function staff(): BelongsTo
  {
    return $this->belongsTo(Staff::class);
  }

  public function shipmentReview(): HasOne
  {
    return $this->hasOne(ShipmentReview::class);
  }

  public function shipmentStatusMethods(): HasMany
  {
    return $this->hasMany(ShipmentStatusMethod::class);
  }
}
