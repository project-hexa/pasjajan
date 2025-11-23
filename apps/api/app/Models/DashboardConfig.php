<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardConfig extends Model
{
  use HasFactory;

  protected $table = 'dashboard_config';

  protected $fillable = [
    'store_id',
    'store_name',
    'address',
    'phone',
    'status',
  ];

  protected $casts = [
    'status' => 'string',
  ];
}
