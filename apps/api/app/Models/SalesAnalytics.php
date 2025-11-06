<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'start_period',
        'end_period',
        'total_sold',
        'sales_trend',
        'sales_rank',
    ];

    protected $casts = [
        'start_period' => 'date',
        'end_period' => 'date',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
