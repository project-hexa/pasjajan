<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Customer;
use App\Models\Voucher;
use App\Models\Address;
use App\Models\Store;
use App\Models\PaymentMethod;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class);
            $table->foreignIdFor(Voucher::class);
            $table->foreignIdFor(Address::class);
            $table->foreignIdFor(Store::class);
            $table->foreignIdFor(PaymentMethod::class);
            $table->string('code');
            $table->enum('status', ['PENDING', 'PROCESSED', 'COMPLETED']);
            $table->decimal('subtotal', total: 10, places: 2);
            $table->decimal('discount', total: 10, places: 2)->nullable();
            $table->decimal('shipping_fee', total: 10, places: 2);
            $table->decimal('grand_total', total: 10, places: 2);
            $table->string('midtrans_transaction_id')->nullable();
            $table->string('midtrans_order_id')->nullable();
            $table->json('payment_instructions')->nullable();
            $table->string('payment_status')->nullable();
            $table->dateTime('paid_at')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
