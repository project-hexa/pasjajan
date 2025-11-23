<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
  use HasFactory;

  protected $fillable = [
    'method_name',
    'payment_type',
    'fee',
  ];

  protected $casts = [
    'fee' => 'decimal:2',
  ];

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }
}
