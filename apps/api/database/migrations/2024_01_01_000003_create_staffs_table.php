<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('staffs', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('store_id');
      $table->timestamps();

      $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('staffs');
  }
};
