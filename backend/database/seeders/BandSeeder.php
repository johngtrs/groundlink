<?php

namespace Database\Seeders;

use App\Models\Band;
use App\Models\Genre;
use Database\Data\BandData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BandSeeder extends Seeder
{
    public function run(): void
    {
        $bands = BandData::all();

        foreach ($bands as $bandData) {
            $band = Band::factory()->create([
                'name'                => $bandData['name'],
                'formatted_address'   => $bandData['formatted_address'],
                'postal_code'         => $bandData['postal_code'],
                'city'                => $bandData['city'],
                'department'          => $bandData['department'],
                'region'              => $bandData['region'],
                'country'             => $bandData['country'],
            ]);

            foreach ($bandData['genres'] as $genreName) {
                $genre = Genre::firstWhere(['name' => $genreName]);
                if ($genre) {
                    $band->genres()->attach($genre->id);
                }
            }

            $user = $band->user()->create([
                'name'     => $bandData['name'],
                'email'    => Str::slug($bandData['name']) . '@example.com',
                'password' => '$2y$12$O9oum81hgExwoSixLTpzdOaDrvluYPudzUgMOikW0kcJqsUM3nate',
            ]);

            $user->assignRole('band');
        }
    }
}
