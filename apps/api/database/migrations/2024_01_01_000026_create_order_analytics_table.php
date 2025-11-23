<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('order_analytics', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('product_id');
      $table->date('start_period');
      $table->date('end_period');
      $table->integer('total_sold');
      $table->string('sales_trend', 20)->nullable();
      $table->integer('sales_rank')->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('order_analytics');
  }
};
