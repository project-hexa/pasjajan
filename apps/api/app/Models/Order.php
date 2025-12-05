<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'customer_id',
        'address_id',
        'store_id',
        'voucher_id',
        'payment_method_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'shipping_address',
        'shipping_recipient_name',
        'shipping_recipient_phone',
        'sub_total',
        'discount',
        'shipping_fee',
        'admin_fee',
        'grand_total',
        'midtrans_transaction_id',
        'midtrans_order_id',
        'payment_instructions',
        'status',
        'payment_status',
        'paid_at',
        'expired_at',
        'notes',
    ];

    protected $casts = [
        'sub_total' => 'decimal:2',
        'discount' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'admin_fee' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'payment_instructions' => 'array',
        'paid_at' => 'datetime',
        'expired_at' => 'datetime',
    ];

    // Relationships
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    // Helper Methods - Order Status
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isConfirmed()
    {
        return $this->status === 'confirmed';
    }

    public function isProcessing()
    {
        return $this->status === 'processing';
    }

    public function isShipped()
    {
        return $this->status === 'shipped';
    }

    public function isDelivered()
    {
        return $this->status === 'delivered';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    // Helper Methods - Payment Status
    public function isUnpaid()
    {
        return $this->payment_status === 'unpaid';
    }

    public function isPaymentPending()
    {
        return $this->payment_status === 'pending';
    }

    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }

    public function isPaymentFailed()
    {
        return in_array($this->payment_status, ['failed', 'expired']);
    }

    public function isRefunded()
    {
        return $this->payment_status === 'refunded';
    }

    // Business Logic
    public function canBeCancelled(): bool
    {
        // Order bisa di-cancel jika:
        // 1. Status masih pending atau confirmed
        // 2. Belum dalam proses pengiriman
        return in_array($this->status, ['pending', 'confirmed']) &&
            !$this->isProcessing() &&
            !$this->isShipped();
    }

    public function canBeRefunded(): bool
    {
        // Order bisa di-refund jika:
        // 1. Sudah dibayar
        // 2. Belum di-refund sebelumnya
        return $this->isPaid() && !$this->isRefunded();
    }

    public function isExpired(): bool
    {
        return $this->expired_at && $this->expired_at->isPast();
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUnpaid($query)
    {
        return $query->where('payment_status', 'unpaid');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'paid');
    }

    public function scopeByCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeRecent($query, int $limit = 10)
    {
        return $query->orderBy('created_at', 'desc')->limit($limit);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
