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
      $table->unsignedBigInteger('user_id');
      $table->unsignedBigInteger('store_id');
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $table->foreign('store_id')->references('id')->on('stores')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('staffs');
  }
};
