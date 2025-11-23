<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('history_points', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('customer_id');
      $table->enum('type', ['credit', 'debit']);
      $table->text('notes')->nullable();
      $table->integer('total_point');
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('history_points');
  }
};
