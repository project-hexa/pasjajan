<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Address extends Model
{
	protected $fillable = [
		'customer_id',
		'label',
		'detail_address',
		'notes_address',
		'recipient_name',
		'phone_number',
		'latitude',
		'longitude',
		'is_default'
	];
	public function customers(): BelongsTo
	{
		return $this->belongsTo(Customer::class);
	}
}
