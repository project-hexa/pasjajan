<?php
// app/Models/CustomerAnalytics.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAnalytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'favorite_product',
        'purchase_count',
        'transaction_frequency',
        'total_spending',
        'analysis_period'
    ];
}
