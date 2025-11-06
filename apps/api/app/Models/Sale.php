<?php
// app/Models/Sale.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'sale_date',
        'product_id',
        'quantity_sold',
        'total_price',
        'payment_method',
        'admin_id',
        'branch_id'
    ];

    protected $casts = ['sale_date' => 'date'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
