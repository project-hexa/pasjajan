<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Address extends Model
{
  use HasFactory;

  protected $table = 'address';

  protected $fillable = [
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

  public function orders(): HasMany
  {
    return $this->hasMany(Order::class);
  }
}
