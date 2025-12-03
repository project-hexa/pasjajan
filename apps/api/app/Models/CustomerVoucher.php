<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerVoucher extends Model
{
	public function customer(): BelongsTo
	{
		return $this->belongsTo(Customer::class);
	}

	public function voucher(): BelongsTo
	{
		return $this->belongsTo(Voucher::class);
	}
}
