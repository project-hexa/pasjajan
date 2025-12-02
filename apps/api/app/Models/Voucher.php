<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Voucher extends Model
{
	public function customerVouchers(): HasMany
	{
		return $this->hasMany(CustomerVoucher::class);
	}
}
