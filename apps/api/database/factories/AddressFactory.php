<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory
{
  protected $model = Address::class;

  public function definition(): array
  {
    return [
      'customer_id' => Customer::factory(),
      'label' => $this->faker->randomElement(['Rumah', 'Kantor', 'Kos', 'Toko']),
      'detail_address' => $this->faker->address(),
      'notes_address' => $this->faker->optional()->sentence(),
      'recipient_name' => $this->faker->name(),
      'phone_number' => $this->faker->numerify('08##########'),
      'latitude' => $this->faker->latitude(-10, 10),
      'longitude' => $this->faker->longitude(95, 141),
      'is_default' => $this->faker->boolean(20),
    ];
  }
}
