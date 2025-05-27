<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Venue;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class VenueSeeder extends Seeder
{
    public function run(): void
    {
        $venues = [
            'La Cigale', 'Le Bataclan', 'Zénith de Paris - La Villette', 'Accor Arena',
            'Stade de France', 'Adidas Arena', 'Petit Bain', "O'Sullivan's Backstage",
            "L'Élysée Montmartre", 'Le Plan', "Rock'n'Eat", 'La Coopérative de Mai',
            'Le Bikini', 'La Vapeur', 'La Cartonnerie', 'Le Kilowatt',
            'Les Instants Chavirés', 'Salle Pleyel', 'La Maroquinerie', 'La Machine du Moulin Rouge',
        ];

        foreach ($venues as $venueName) {
            $venue = Venue::factory()->create([
                'name' => $venueName,
            ]);

            $user = $venue->user()->create([
                'name'     => $venueName,
                'email'    => Str::slug($venueName) . '@example.com',
                'password' => Hash::make('password'),
            ]);

            $user->assignRole('venue');
        }
    }
}
