 <?php

    use Illuminate\Database\Migrations\Migration;
    use Illuminate\Database\Schema\Blueprint;
    use Illuminate\Support\Facades\Schema;
    use App\Models\Order;
    use App\Models\Product;

    return new class extends Migration
    {
        /**
         * Run the migrations.
         */
        public function up(): void
        {
            Schema::create('order_items', function (Blueprint $table) {
                $table->id();

                // Foreign Keys with proper constraints
                $table->foreignIdFor(Order::class)
                    ->constrained()
                    ->cascadeOnDelete(); // Delete items when order deleted

                $table->foreignIdFor(Product::class)
                    ->constrained()
                    ->restrictOnDelete(); // Prevent delete product if in orders

                // Pricing snapshot 
                $table->decimal('price', 10, 2); // Unit price at order time
                $table->integer('quantity'); // Item quantity
                $table->decimal('sub_total', 10, 2); // price * quantity

                $table->timestamps();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('order_items');
        }
    };
