<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
  use HasFactory;

  protected $fillable = [
    'code',
  ];

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }

  public function historyPoints(): HasMany
  {
    return $this->hasMany(HistoryPoint::class);
  }

  public function carts(): HasMany
  {
    return $this->hasMany(Cart::class);
  }

  public function customerVouchers(): HasMany
  {
    return $this->hasMany(CustomerVoucher::class);
  }

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }

  public function customerAnalytics(): HasMany
  {
    return $this->hasMany(CustomerAnalytic::class);
  }

  public function vouchers()
  {
    return $this->belongsToMany(Voucher::class, 'customer_vouchers')
      ->withPivot('redeemed_at', 'is_used', 'used_at')
      ->withTimestamps();
  }
}
