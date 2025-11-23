<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promo extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'discount_value',
    'min_order_value',
    'start_date',
    'end_date',
    'status',
    'applies_to',
    'applies_to_product',
    'created_by',
  ];

  protected $casts = [
    'discount_value' => 'decimal:2',
    'min_order_value' => 'decimal:2',
    'start_date' => 'date',
    'end_date' => 'date',
  ];

  public function creator(): BelongsTo
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function promoStores(): HasMany
  {
    return $this->hasMany(PromoStore::class);
  }

  public function promoProducts(): HasMany
  {
    return $this->hasMany(PromoProduct::class);
  }

  public function stores()
  {
    return $this->belongsToMany(Store::class, 'promo_stores');
  }

  public function products()
  {
    return $this->belongsToMany(Product::class, 'promo_products');
  }
}
