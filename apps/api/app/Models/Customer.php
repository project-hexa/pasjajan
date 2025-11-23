<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
	public function users(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function addresses(): HasMany
	{
		return $this->hasMany(Address::class);
	}
}
