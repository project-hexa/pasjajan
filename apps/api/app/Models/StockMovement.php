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
    'quantity_change',
    'movement_type',
    'order_id',
    'user_id',
    'notes',
  ];

  protected $casts = [
    'quantity_change' => 'integer',
  ];

  public function store(): BelongsTo
  {
    return $this->belongsTo(Store::class);
  }

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }

  public function order(): BelongsTo
  {
    return $this->belongsTo(Order::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
