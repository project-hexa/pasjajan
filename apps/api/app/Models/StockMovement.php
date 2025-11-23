<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
  use HasFactory;

  protected $fillable = [
    'store_id',
    'product_id',
    'movement_name',
    'movement_type',
    'quantity',
    'notes',
    'user_id',
    'token',
  ];

  protected $casts = [
    'quantity' => 'integer',
  ];

  public function store(): BelongsTo
  {
    return $this->belongsTo(Store::class);
  }

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
