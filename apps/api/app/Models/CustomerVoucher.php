<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerVoucher extends Model
{
  use HasFactory;

  protected $fillable = [
    'customer_id',
    'voucher_id',
    'redeemed_at',
    'is_used',
    'used_at',
  ];

  protected $casts = [
    'redeemed_at' => 'datetime',
    'is_used' => 'boolean',
    'used_at' => 'datetime',
  ];

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }

  public function voucher(): BelongsTo
  {
    return $this->belongsTo(Voucher::class);
  }
}
