<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('orders', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('customer_id');
      $table->unsignedBigInteger('voucher_id')->nullable();
      $table->unsignedBigInteger('address_id');
      $table->unsignedBigInteger('store_id');
      $table->unsignedBigInteger('payment_method_id');
      $table->string('code', 50);
      $table->enum('status', ['PENDING', 'PROCESSING', 'PROCESSED', 'COMPLETED'])->default('PENDING');
      $table->decimal('sub_total', 10, 2);
      $table->decimal('discount', 10, 2)->default(0);
      $table->decimal('shipping_fee', 10, 2);
      $table->decimal('grand_total', 10, 2);
      $table->string('midtrans_transaction_id', 50)->nullable();
      $table->string('midtrans_order_id', 50)->nullable();
      $table->json('payment_instructions')->nullable();
      $table->enum('payment_status', ['PENDING', 'SETTLEMENT', 'EXPIRE'])->default('PENDING');
      $table->dateTime('paid_at')->nullable();
      $table->dateTime('expired_at')->nullable();
      $table->text('notes')->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
      $table->foreign('voucher_id')->references('id')->on('vouchers')->onDelete('set null');
      $table->foreign('address_id')->references('id')->on('address')->onDelete('cascade');
      $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
      $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('orders');
  }
};
