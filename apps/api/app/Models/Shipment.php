<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function method()
    {
        return $this->belongsTo(ShipmentMethod::class, 'method_id');
    }

    public function staff()
    {
        return $this->belongsTo(Staff::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(ShipmentStatusLog::class, 'shipment_id');
    }

    public function review()
    {
        return $this->hasOne(ShipmentReview::class, 'shipment_id');
    }
}
