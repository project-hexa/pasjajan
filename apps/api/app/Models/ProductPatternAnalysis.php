<?php
// app/Models/ProductPatternAnalysis.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductPatternAnalysis extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'associated_product_id',
        'frequency',
        'analysis_period'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function associated()
    {
        return $this->belongsTo(Product::class, 'associated_product_id');
    }
}
