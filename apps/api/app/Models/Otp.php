<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Otp extends Model
{
	protected $fillable = [
		'user_id',
		'email',
		'otp',
		'expires_at',
	];

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}
}
