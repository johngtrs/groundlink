<?php

namespace Database\Factories;

use App\Models\Venue;
use Illuminate\Database\Eloquent\Factories\Factory;

class VenueFactory extends Factory
{
    protected $model = Venue::class;

    public function definition(): array
    {
        return [
            'name'              => $this->faker->company,
            'formatted_address' => $this->faker->address,
            'city'              => $this->faker->city,
            'country'           => $this->faker->country,
            'lat'               => $this->faker->latitude,
            'lng'               => $this->faker->longitude,
            'website'           => $this->faker->url,
            'capacity'          => $this->faker->numberBetween(50, 1000),
            'description'       => $this->faker->paragraph,
        ];
    }
}
