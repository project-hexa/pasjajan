<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class Voucher extends Model
{
	protected $fillable = [
		'code',
		'name',
		'description',
		'discount_value',
		'required_points',
		'start_date',
		'end_date',
		'is_active',
		'created_by',
	];

	protected $casts = [
		'discount_value' => 'decimal:2',
		'required_points' => 'integer',
		'start_date' => 'date',
		'end_date' => 'date',
		'is_active' => 'boolean',
	];

	/**
	 * Scope untuk voucher yang tersedia untuk ditukar
	 */
	public function scopeAvailable(Builder $query): Builder
	{
		return $query->where('is_active', true)
			->where('start_date', '<=', now())
			->where('end_date', '>=', now());
	}

	public function customerVouchers(): HasMany
	{
		return $this->hasMany(CustomerVoucher::class);
	}
}
