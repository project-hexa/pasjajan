<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model
{
	public function customer(): BelongsTo
	{
		return $this->hasMany(customer::class);
	}

	public function product(): BelongsTo
	{
		return $this->hasMany(Product::class);
	}
}
