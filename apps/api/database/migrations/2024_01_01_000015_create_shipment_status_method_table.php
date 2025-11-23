<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('shipment_status_method', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('shipment_id');
      $table->string('status_name', 50);
      $table->dateTime('created_at')->useCurrent();
      $table->dateTime('updated_at')->useCurrent();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('shipment_status_method');
  }
};
