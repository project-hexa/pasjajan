<?php

namespace Database\Factories;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ActivityLogFactory extends Factory
{
  protected $model = ActivityLog::class;

  public function definition(): array
  {
    $activityTypes = [
      'login',
      'logout',
      'create_order',
      'update_order',
      'delete_order',
      'create_product',
      'update_product',
      'delete_product',
      'view_report',
    ];

    return [
      'user_id' => User::factory(),
      'activity_type' => $this->faker->randomElement($activityTypes),
      'description' => $this->faker->sentence(),
      'timestamp' => $this->faker->dateTimeBetween('-1 month', 'now'),
      'ip_address' => $this->faker->ipv4(),
    ];
  }
}
