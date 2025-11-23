<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
  use HasFactory;

  protected $fillable = [
    'code',
    'name',
    'address',
    'phone_number',
    'latitude',
    'longitude',
    'is_active',
  ];

  protected $casts = [
    'is_active' => 'boolean',
    'latitude' => 'decimal:8',
    'longitude' => 'decimal:8',
  ];

  public function stockMovements(): HasMany
  {
    return $this->hasMany(StockMovement::class);
  }

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }

  public function promoStores(): HasMany
  {
    return $this->hasMany(PromoStore::class);
  }

  public function promos()
  {
    return $this->belongsToMany(Promo::class, 'promo_stores');
  }
}
