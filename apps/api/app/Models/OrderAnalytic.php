<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderAnalytic extends Model
{
  use HasFactory;

  protected $fillable = [
    'product_id',
    'start_period',
    'end_period',
    'total_sold',
    'sales_trend',
    'sales_rank',
  ];

  protected $casts = [
    'start_period' => 'date',
    'end_period' => 'date',
    'total_sold' => 'integer',
    'sales_rank' => 'integer',
  ];

  public function product(): BelongsTo
  {
    return $this->belongsTo(Product::class);
  }
}
