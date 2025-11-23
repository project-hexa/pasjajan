<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Voucher extends Model
{
  use HasFactory;

  protected $fillable = [
    'code',
    'name',
    'description',
    'discount_value',
    'required_points',
    'start_date',
    'end_date',
    'is_active',
    'created_by',
  ];

  protected $casts = [
    'discount_value' => 'decimal:2',
    'required_points' => 'integer',
    'start_date' => 'date',
    'end_date' => 'date',
    'is_active' => 'boolean',
  ];

  public function creator(): BelongsTo
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function customerVouchers(): HasMany
  {
    return $this->hasMany(CustomerVoucher::class);
  }

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }

  public function customers()
  {
    return $this->belongsToMany(Customer::class, 'customer_vouchers')
      ->withPivot('redeemed_at', 'is_used', 'used_at')
      ->withTimestamps();
  }
}
