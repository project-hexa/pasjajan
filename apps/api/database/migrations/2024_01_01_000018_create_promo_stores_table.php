<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('promo_stores', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('promo_id');
      $table->unsignedBigInteger('store_id');
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('promo_id')->references('id')->on('promos')->onDelete('cascade');
      $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('promo_stores');
  }
};
