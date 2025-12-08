<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Order;
use App\Models\ShipmentMethod;
use App\Models\Staff;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Order::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(ShipmentMethod::class, 'method_id')->constrained('shipment_methods');
            $table->foreignIdFor(Staff::class)->nullable()->constrained()->cascadeOnDelete();
            $table->string('completion_status');
            $table->decimal('cost', total: 10, places: 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
