<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{

	protected $fillable = [
		'code',
		'name',
		'address',
		'phone_number',
		'latitude',
		'longitude',
		'is_active',
	];

	public function staffs(): HasMany
	{
		return $this->HasMany(Staff::class);
	}

	public function orders(): HasMany
	{
		return $this->hasMany(Order::class);
	}
}
