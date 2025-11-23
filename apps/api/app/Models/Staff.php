<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Staff extends Model
{
  use HasFactory;

  protected $table = 'staffs';

  protected $fillable = [
    'store_id',
  ];

  public function store(): BelongsTo
  {
    return $this->belongsTo(Store::class);
  }

  public function user(): BelongsTo
  {
    return $this->belongsTo(User::class);
  }
}
