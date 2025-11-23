<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('shipment_reviews', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('shipment_id');
      $table->integer('rating');
      $table->text('comment')->nullable();
      $table->dateTime('review_date')->useCurrent();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('shipment_id')->references('id')->on('shipments')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('shipment_reviews');
  }
};
