<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'phone_number' => $this->faker->numerify('08##########'),
            'username' => fake()->unique()->userName(),
            'password' => static::$password ??= Hash::make('password'),
            'birth_date' => fake()->date('Y-m-d', '-18 years'),
            'gender' => $this->faker->randomElement(['Laki-Laki', 'Perempuan']),
            'phone_number_verified_at' => now(),
            'avatar' => $this->faker->optional()->imageUrl(200, 200, 'people'),
            'role' => $this->faker->randomElement(['admin', 'staff', 'customer']),
            'remember_token' => Str::random(10),
            'status_account' => $this->faker->randomElement(['Active', 'Inactive', 'Pending']),
            'last_login_date' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'reason_deleted' => null,
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
