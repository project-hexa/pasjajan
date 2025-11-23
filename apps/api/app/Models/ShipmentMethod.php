<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ShipmentMethod extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
  ];

  public function shipments(): HasMany
  {
    return $this->hasMany(Shipment::class, 'method_id');
  }
}
