<?php
// database/seeders/DatabaseSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\{
    User,
    Branch,
    Product,
    BranchStock,
    Promo,
    Sale,
    SalesReport,
    SalesAnalytics,
    CustomerAnalytics,
    ProductPatternAnalysis,
    BroadcastMessage,
    ActivityLog,
    DashboardConfig
};

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run(): void
    {
        User::factory(5)->create();
        Branch::factory(3)->create();
        Product::factory(10)->create();
        Sale::factory(30)->create();
        SalesReport::factory(5)->create();
        BranchStock::factory(15)->create();
        Promo::factory(5)->create();
        SalesAnalytics::factory(10)->create();
        BroadcastMessage::factory(3)->create();
        ActivityLog::factory(10)->create();
    }
}
