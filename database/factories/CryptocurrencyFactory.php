<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cryptocurrency>
 */
class CryptocurrencyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'symbol' => fake()->currencyCode(),
            'name' => fake()->name(),
            'image_url' => fake()->imageUrl(),
            'api_id' => 1,
        ];
    }
}
