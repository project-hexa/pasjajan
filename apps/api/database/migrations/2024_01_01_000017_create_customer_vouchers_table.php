<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('customer_vouchers', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('customer_id');
      $table->unsignedBigInteger('voucher_id');
      $table->dateTime('redeemed_at')->nullable();
      $table->boolean('is_used')->default(false);
      $table->dateTime('used_at')->nullable();
      $table->dateTime('created_at')->useCurrent();
      $table->dateTime('updated_at')->useCurrent();

      $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
      $table->foreign('voucher_id')->references('id')->on('vouchers')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('customer_vouchers');
  }
};
