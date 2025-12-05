<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShipmentReview extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public $timestamps = false;

    public function shipment()
    {
        return $this->belongsTo(Shipment::class);
    }
}
