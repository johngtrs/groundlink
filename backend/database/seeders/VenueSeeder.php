<?php

namespace Database\Seeders;

use App\Models\Venue;
use Database\Data\VenueData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        $venues = VenueData::all();

        foreach ($venues as $venueData) {
            $venue = Venue::factory()->create([
                'name'              => $venueData['name'],
                'formatted_address' => $venueData['formatted_address'],
                'address'           => $venueData['address'],
                'postal_code'       => $venueData['postal_code'],
                'city'              => $venueData['city'],
                'department'        => $venueData['department'],
                'region'            => $venueData['region'],
                'country'           => $venueData['country'],
            ]);

            $user = $venue->user()->create([
                'name'     => $venueData['name'],
                'email'    => Str::slug($venueData['name']) . '@example.com',
                'password' => Hash::make('password'),
            ]);

            $user->assignRole('venue');
        }
    }
}
