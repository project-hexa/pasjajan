<?php

namespace Database\Factories;

use App\Models\OrderReport;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderReportFactory extends Factory
{
  protected $model = OrderReport::class;

  public function definition(): array
  {
    $startPeriod = $this->faker->dateTimeBetween('-1 year', '-1 month');
    $endPeriod = $this->faker->dateTimeBetween($startPeriod, 'now');

    $transactionCount = $this->faker->numberBetween(100, 5000);
    $totalProductsSold = $this->faker->numberBetween($transactionCount, $transactionCount * 3);

    return [
      'start_period' => $startPeriod,
      'end_period' => $endPeriod,
      'total_sales' => $this->faker->randomFloat(2, 1000000, 50000000),
      'transaction_count' => $transactionCount,
      'total_products_sold' => $totalProductsSold,
      'export_file' => $this->faker->optional(0.5)->bothify('report_????_##########.xlsx'),
    ];
  }
}
