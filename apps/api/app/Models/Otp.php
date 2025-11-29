<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Otp extends Model
{
	protected $fillable = [
		'user_id',
		'otp',
		'expires_at',
	];

	public function users(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}
}
