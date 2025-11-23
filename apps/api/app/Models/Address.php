<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
  use HasFactory;

  protected $table = 'address';

  protected $fillable = [
    'customer_id',
    'label',
    'detail_address',
    'notes_address',
    'recipient_name',
    'phone_number',
    'latitude',
    'longitude',
    'is_default',
  ];

  protected $casts = [
    'latitude' => 'decimal:8',
    'longitude' => 'decimal:8',
    'is_default' => 'boolean',
  ];

  public function customer(): BelongsTo
  {
    return $this->belongsTo(Customer::class);
  }

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }
}
