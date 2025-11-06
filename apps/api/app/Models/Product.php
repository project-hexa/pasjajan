<?php
// app/Models/Product.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['product_name', 'price', 'description', 'stock', 'branch_id', 'status'];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
    public function salesAnalytics()
    {
        return $this->hasMany(SalesAnalytics::class);
    }
    public function branchStocks()
    {
        return $this->hasMany(BranchStock::class);
    }
    public function patternPrimaries()
    {
        return $this->hasMany(ProductPatternAnalysis::class, 'product_id');
    }
    public function patternAssociated()
    {
        return $this->hasMany(ProductPatternAnalysis::class, 'associated_product_id');
    }
}
