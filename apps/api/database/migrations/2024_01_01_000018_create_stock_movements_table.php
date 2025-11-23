<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('stock_movements', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('store_id');
      $table->unsignedBigInteger('product_id');
      $table->integer('quantity_change');
      $table->enum('movement_type', ['sale', 'delivery', 'correction'])->nullable();
      $table->unsignedBigInteger('order_id')->nullable();
      $table->unsignedBigInteger('user_id')->nullable();
      $table->text('notes')->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
      $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
      $table->foreign('order_id')->references('id')->on('orders')->onDelete('set null');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('stock_movements');
  }
};
