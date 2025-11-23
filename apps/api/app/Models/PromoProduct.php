<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromoProduct extends Model
{
  use HasFactory;

  protected $fillable = [
    'promo_id',
    'product_id',
  ];

  public function promo(): BelongsTo
  {
    return $this->belongsTo(Promo::class);
  }

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }
}
