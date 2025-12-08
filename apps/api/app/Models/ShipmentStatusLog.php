<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentStatusLog extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }
}
