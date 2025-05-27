<?php

namespace Database\Factories;

use App\Models\Band;
use Illuminate\Database\Eloquent\Factories\Factory;

class BandFactory extends Factory
{
    protected $model = Band::class;

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
            'spotify'           => 'https://open.spotify.com/artist/' . $this->faker->uuid,
            'description'       => $this->faker->paragraph,
        ];
    }
}
