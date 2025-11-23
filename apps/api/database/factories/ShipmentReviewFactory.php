<?php

namespace Database\Factories;

use App\Models\ShipmentReview;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentReviewFactory extends Factory
{
  protected $model = ShipmentReview::class;

  public function definition(): array
  {
    return [
      'shipment_id' => Shipment::factory(),
      'rating' => $this->faker->numberBetween(1, 5),
      'comment' => $this->faker->optional(0.7)->paragraph(),
      'review_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
    ];
  }
}
