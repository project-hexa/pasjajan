<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromoStore extends Model
{
  use HasFactory;

  protected $fillable = [
    'promo_id',
    'store_id',
  ];

  public function promo(): BelongsTo
  {
    return $this->belongsTo(Promo::class);
  }

  public function store(): BelongsTo
  {
    return $this->belongsTo(Store::class);
  }
}
