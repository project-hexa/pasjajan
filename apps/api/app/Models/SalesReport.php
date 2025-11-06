<?php
// app/Models/SalesReport.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalesReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'branch_id',
        'start_period',
        'end_period',
        'total_sales',
        'transaction_count',
        'total_products_sold',
        'export_file'
    ];

    protected $casts = ['start_period' => 'date', 'end_period' => 'date'];

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
