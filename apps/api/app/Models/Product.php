<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
	public function productCategory(): BelongsTo
	{
		return $this->belongsTo(ProductCategory::class);
	}

	public function carts(): HasMany
	{
		return $this->hasMany(Cart::class);
	}
}
