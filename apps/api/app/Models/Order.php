<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
  use HasFactory;

  protected $fillable = [
    'customer_id',
    'voucher_id',
    'address_id',
    'store_id',
    'payment_method_id',
    'code',
    'status',
    'sub_total',
    'discount',
    'shipping_fee',
    'grand_total',
    'midtrans_transaction_id',
    'midtrans_order_id',
    'payment_instructions',
    'payment_status',
    'paid_at',
    'expired_at',
    'notes',
  ];

  protected $casts = [
    'sub_total' => 'decimal:2',
    'discount' => 'decimal:2',
    'shipping_fee' => 'decimal:2',
    'grand_total' => 'decimal:2',
    'payment_instructions' => 'array',
    'paid_at' => 'datetime',
    'expired_at' => 'datetime',
  ];

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }

  public function voucher(): BelongsTo
  {
    return $this->belongsTo(Voucher::class);
  }

  public function address(): BelongsTo
  {
    return $this->belongsTo(Address::class);
  }

  public function store(): BelongsTo
  {
    return $this->belongsTo(Store::class);
  }

  public function paymentMethod(): BelongsTo
  {
    return $this->belongsTo(PaymentMethod::class);
  }

  public function orderItems(): HasMany
  {
    return $this->hasMany(OrderItem::class);
  }

  public function shipment(): HasOne
  {
    return $this->hasOne(Shipment::class);
  }
}
