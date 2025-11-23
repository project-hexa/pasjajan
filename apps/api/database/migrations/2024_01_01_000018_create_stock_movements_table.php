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
      $table->string('movement_name', 50);
      $table->enum('movement_type', ['in', 'out'])->nullable();
      $table->integer('quantity');
      $table->string('notes', 255)->nullable();
      $table->unsignedBigInteger('user_id')->nullable();
      $table->text('token')->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
      $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
      $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('stock_movements');
  }
};
