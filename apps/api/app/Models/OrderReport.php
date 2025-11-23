<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderReport extends Model
{
  use HasFactory;

  protected $fillable = [
    'start_period',
    'end_period',
    'total_sales',
    'transaction_count',
    'total_products_sold',
    'export_file',
  ];

  protected $casts = [
    'start_period' => 'date',
    'end_period' => 'date',
    'total_sales' => 'decimal:2',
    'transaction_count' => 'integer',
    'total_products_sold' => 'integer',
  ];
}
