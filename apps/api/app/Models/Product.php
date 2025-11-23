<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
  use HasFactory;

  protected $fillable = [
    'product_category_id',
    'name',
    'code',
    'description',
    'price',
    'stock',
    'image_url',
  ];

  protected $casts = [
    'price' => 'decimal:2',
    'stock' => 'integer',
  ];

  public function productCategory(): BelongsTo
  {
    return $this->belongsTo(ProductCategory::class);
  }

  public function carts(): HasMany
  {
    return $this->hasMany(Cart::class);
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  public function stockMovements(): HasMany
  {
    return $this->hasMany(StockMovement::class);
  }

  public function orderAnalytics(): HasMany
  {
    return $this->hasMany(OrderAnalytic::class);
  }

  public function promoProducts(): HasMany
  {
    return $this->hasMany(PromoProduct::class);
  }

  public function promos()
  {
    return $this->belongsToMany(Promo::class, 'promo_products');
  }
}
