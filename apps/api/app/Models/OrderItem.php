<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
	public function orders(): BelongsTo
	{
		return $this->belongsTo(OrderItem::class);
	}
}
