<?php
// app/Models/Branch.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = ['branch_name', 'address', 'phone', 'status'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function branchStocks()
    {
        return $this->hasMany(BranchStock::class);
    }
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }
    public function salesReports()
    {
        return $this->hasMany(SalesReport::class);
    }
    public function dashboardConfig()
    {
        return $this->hasOne(DashboardConfig::class);
    }
}
