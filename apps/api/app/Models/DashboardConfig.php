<?php
// app/Models/DashboardConfig.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardConfig extends Model
{
    use HasFactory;

    protected $fillable = ['branch_id', 'name', 'address', 'phone', 'status'];

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }
}
