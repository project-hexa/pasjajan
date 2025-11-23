<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'channel',
        'icon',
        'fee',
        'min_amount',
        'max_amount',
        'description',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'fee' => 'decimal:2',
        'min_amount' => 'integer',
        'max_amount' => 'integer',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];

    // Relationships
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }

    // Helper Methods
    public function isValidAmount(float $amount): bool
    {
        if ($amount < $this->min_amount) {
            return false;
        }

        if ($this->max_amount && $amount > $this->max_amount) {
            return false;
        }

        return true;
    }

    public function getIconUrlAttribute(): ?string
    {
        if (!$this->icon) {
            return null;
        }

        // Jika sudah full URL
        if (filter_var($this->icon, FILTER_VALIDATE_URL)) {
            return $this->icon;
        }

        // Jika filename, return path
        return asset('images/payment-methods/' . $this->icon);
    }
}
