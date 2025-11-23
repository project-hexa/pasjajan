<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('customer_analytics', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('customer_id');
      $table->string('favorite_product', 100)->nullable();
      $table->integer('purchase_count');
      $table->enum('transaction_frequency', ['low', 'medium', 'high'])->nullable();
      $table->decimal('total_spending', 15, 2);
      $table->date('analysis_period')->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('customer_analytics');
  }
};
