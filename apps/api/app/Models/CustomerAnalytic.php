<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerAnalytic extends Model
{
  use HasFactory;

  protected $fillable = [
    'customer_id',
    'favorite_product',
    'purchase_count',
    'transaction_frequency',
    'total_spending',
    'analysis_period',
  ];

  protected $casts = [
    'purchase_count' => 'integer',
    'total_spending' => 'decimal:2',
    'analysis_period' => 'date',
  ];

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }
}
