<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Promo extends Model
{
    protected $table = 'promos';

    protected $fillable = [
        'name',
        'banner',
        'description',
        'discount_percentage',
        'min_order_value',
        'start_date',
        'end_date',
        'status',
        'applies_to',
        'applies_to_product',
        'created_by',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    // Relasi ke toko
    public function stores()
    {
        return $this->belongsToMany(Store::class, 'promo_stores', 'promo_id', 'store_id')
            ->withTimestamps();
    }

    // Relasi ke produk
    public function products()
    {
        return $this->belongsToMany(Product::class, 'promo_products', 'promo_id', 'product_id')
            ->withTimestamps();
    }

    /**
     * Scope untuk promo yang sedang aktif.
     *
     * Opsional filter:
     * - store_id
     * - product_id
     */
    public function scopeActive(Builder $query, $storeId = null, $productId = null): Builder
    {
        $now = Carbon::now();

        $query->where('status', 'Active')
            ->where(function ($q) use ($now) {
                $q->whereNull('start_date')
                    ->orWhere('start_date', '<=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $now);
            });

        if ($storeId) {
            $query->whereHas('stores', function ($q) use ($storeId) {
                $q->where('store_id', $storeId);
            });
        }

        if ($productId) {
            $query->whereHas('products', function ($q) use ($productId) {
                $q->where('product_id', $productId);
            });
        }

        return $query;
    }
}
