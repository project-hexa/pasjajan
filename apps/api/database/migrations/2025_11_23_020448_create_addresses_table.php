<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Customer;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class); // Create unsigned BIGINT
            $table->string('label');
            $table->string('detail_address');
            $table->string('notes_address')->nullable();
            $table->string('recipient_name');
            $table->string('phone_number');
            $table->decimal('latitude', total:10, places:8)->nullable();
            $table->decimal('longitude', total:11, places:8)->nullable();
            $table->boolean('is_default'); // Is primary address or not
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
