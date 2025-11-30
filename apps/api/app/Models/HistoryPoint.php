<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoryPoint extends Model
{
	public function customer(): BelongsTo
	{
		return $this->belongsTo(Customer::class);
	}
}
