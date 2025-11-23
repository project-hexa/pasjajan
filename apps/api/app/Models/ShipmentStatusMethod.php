<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShipmentStatusMethod extends Model
{
  use HasFactory;

  protected $table = 'shipment_status_method';

  protected $fillable = [
    'shipment_id',
    'status_name',
  ];

  public function shipment(): BelongsTo
  {
    return $this->belongsTo(Shipment::class);
  }
}
