<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoryPoint extends Model
{
	protected $fillable = [
		'customer_id',
		'type',
		'notes',
		'total_point',
	];

	public function customer(): BelongsTo
	{
		return $this->belongsTo(Customer::class);
	}
}
