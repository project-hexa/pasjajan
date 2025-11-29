<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Staff extends Model
{
	public function users(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function stores(): BelongsTo
	{
		return $this->belongsTo(Store::class);
	}
}
