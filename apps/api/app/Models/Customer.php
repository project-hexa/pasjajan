<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
	protected $fillable = [
		'user_id',
		'point',
	];

	public function user(): BelongsTo
	{
		return $this->belongsTo(User::class);
	}

	public function addresses(): HasMany
	{
		return $this->hasMany(Address::class);
	}

	public function historyPoints(): HasMany
	{
		return $this->hasMany(HistoryPoint::class);
	}
	
	public function carts(): HasMany
	{
		return $this->hasMany(Cart::class);
	}

	public function customerVouchers(): HasMany
	{
		return $this->hasMany(CustomerVoucher::class);
	}

	public function orders(): HasMany
	{
		return $this->hasMany(Order::class);
	}
}
