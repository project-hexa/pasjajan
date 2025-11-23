<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('shipments', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('order_id');
      $table->unsignedBigInteger('method_id');
      $table->unsignedInteger('staff_id')->nullable();
      $table->enum('completion_status', ['DIKIRIM', 'DELIVERED', 'FAILED'])->default('DIKIRIM');
      $table->text('notes')->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
      $table->foreign('method_id')->references('id')->on('shipment_methods')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('shipments');
  }
};
