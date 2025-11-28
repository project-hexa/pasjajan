<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Store extends Model
{
	public function staffs(): HasMany
	{
		return $this->HasMany(Staff::class);
	}
}
