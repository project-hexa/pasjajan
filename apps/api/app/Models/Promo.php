<?php
// app/Models/Promo.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory;

    protected $fillable = [
        'promo_name',
        'discount_percent',
        'discount_value',
        'start_date',
        'end_date',
        'status',
        'description'
    ];

    protected $casts = ['start_date' => 'date', 'end_date' => 'date'];
}
