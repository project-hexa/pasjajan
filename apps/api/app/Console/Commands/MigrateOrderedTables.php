<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class MigrateOrderedTables extends Command
{
  /**
   * The name and signature of the console command.
   *
   * @var string
   */
  protected $signature = 'migrate:ordered {--fresh : Drop all tables and re-run all migrations} {--seed : Seed the database after migration}';

  /**
   * The console command description.
   *
   * @var string
   */
  protected $description = 'Run migrations in correct order based on foreign key dependencies';

  /**
   * Execute the console command.
   */
  public function handle()
  {
    $this->info('Starting ordered migration process...');

    if ($this->option('fresh')) {
      $this->warn('Dropping all tables...');
      Artisan::call('migrate:fresh', [], $this->getOutput());
      $this->info('All tables dropped.');
      return $this->runSeeder();
    }

    // Ordered list of migrations based on foreign key dependencies
    $migrations = [
      // Level 0: Base tables without foreign keys
      '2024_01_01_000001_create_stores_table',
      '2024_01_01_000002_create_customers_table',
      '2024_01_01_000003_create_staffs_table',
      '2024_01_01_000004_create_product_categories_table',
      '2024_01_01_000005_create_payment_methods_table',
      '2024_01_01_000006_create_shipment_methods_table',
      '2024_01_01_000007_create_dashboard_config_table',
      '2024_01_01_000008_create_activity_log_table',
      '2024_01_01_000009_create_address_table',
      '2024_01_01_000010_create_notifications_table',

      // Level 1: Tables with foreign keys to level 0
      '2024_01_01_000011_create_products_table',
      '2024_01_01_000012_create_history_points_table',
      '2024_01_01_000013_create_vouchers_table',
      '2024_01_01_000014_create_promos_table',

      // Level 2: Tables with foreign keys to level 1
      '2024_01_01_000016_create_carts_table',
      '2024_01_01_000017_create_customer_vouchers_table',
      '2024_01_01_000018_create_stock_movements_table',
      '2024_01_01_000019_create_promo_stores_table',
      '2024_01_01_000020_create_promo_products_table',

      // Level 3: Orders and related tables
      '2024_01_01_000021_create_orders_table',
      '2024_01_01_000022_create_shipments_table',
      '2024_01_01_000015_create_shipment_status_method_table',
      '2024_01_01_000023_create_shipment_reviews_table',
      '2024_01_01_000024_create_order_items_table',

      // Level 4: Analytics and reports
      '2024_01_01_000025_create_order_reports_table',
      '2024_01_01_000026_create_order_analytics_table',
      '2024_01_01_000027_create_customer_analytics_table',
    ];

    $this->info('Running migrations in dependency order...');
    $this->newLine();

    $bar = $this->output->createProgressBar(count($migrations));
    $bar->start();

    foreach ($migrations as $migration) {
      try {
        $this->runSingleMigration($migration);
        $bar->advance();
      } catch (\Exception $e) {
        $bar->finish();
        $this->newLine(2);
        $this->error("Failed to run migration: {$migration}");
        $this->error($e->getMessage());
        return 1;
      }
    }

    $bar->finish();
    $this->newLine(2);
    $this->info('All migrations completed successfully!');

    return $this->runSeeder();
  }

  /**
   * Run a single migration file
   */
  private function runSingleMigration(string $migration): void
  {
    $path = database_path('migrations/' . $migration . '.php');

    if (!file_exists($path)) {
      throw new \Exception("Migration file not found: {$path}");
    }

    // Check if migration has already been run
    $ran = DB::table('migrations')
      ->where('migration', $migration)
      ->exists();

    if (!$ran) {
      Artisan::call('migrate', [
        '--path' => 'database/migrations/' . $migration . '.php',
        '--force' => true,
      ]);
    }
  }

  /**
   * Run seeder if option is provided
   */
  private function runSeeder(): int
  {
    if ($this->option('seed')) {
      $this->newLine();
      $this->info('Seeding database...');
      Artisan::call('db:seed', [], $this->getOutput());
      $this->info('Database seeded successfully!');
    }

    return 0;
  }
}
