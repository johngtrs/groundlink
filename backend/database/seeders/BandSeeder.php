<?php

namespace Database\Seeders;

use App\Models\Band;
use App\Models\User;
use App\Models\Genre;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class BandSeeder extends Seeder
{
    public function run(): void
    {
        $bands = [
            ['name' => 'Landmvrks', 'genres' => ['Metalcore']],
            ['name' => 'Bullet for My Valentine', 'genres' => ['Metalcore', 'Heavy Metal', 'Thrash Metal']],
            ['name' => 'Trivium', 'genres' => ['Metalcore', 'Thrash Metal', 'Progressive Metal']],
            ['name' => 'As I Lay Dying', 'genres' => ['Melodic Metalcore', 'Thrash Metal']],
            ['name' => 'Machine Head', 'genres' => ['Groove Metal', 'Thrash Metal', 'Nu Metal']],
            ['name' => 'Children of Bodom', 'genres' => ['Melodic Death Metal', 'Power Metal']],
            ['name' => 'Avenged Sevenfold', 'genres' => ['Metalcore', 'Heavy Metal', 'Hard Rock']],
            ['name' => 'Korn', 'genres' => ['Nu Metal']],
            ['name' => 'Slipknot', 'genres' => ['Nu Metal', 'Alternative Metal']],
            ['name' => 'Linkin Park', 'genres' => ['Nu Metal', 'Alternative Rock']],
            ['name' => 'Novelists', 'genres' => ['Progressive Metal', 'Metalcore']],
            ['name' => 'Resolve', 'genres' => ['Metalcore']],
            ['name' => 'Ten56', 'genres' => ['Deathcore']],
            ['name' => 'Any Given Day', 'genres' => ['Metalcore']],
            ['name' => 'Heaven Shall Burn', 'genres' => ['Melodic Death Metal', 'Metalcore']],
            ['name' => 'In Flames', 'genres' => ['Melodic Death Metal']],
            ['name' => 'Aurore', 'genres' => ['Hardcore']],
            ['name' => 'In Other Climes', 'genres' => ['Heavy Thrash Hardcore']],
            ['name' => 'Soul Splitter', 'genres' => ['Hardcore']],
            ['name' => 'Common Ennemies', 'genres' => ['Metalcore']],
        ];

        foreach ($bands as $bandData) {
            $band = Band::factory()->create([
                'name' => $bandData['name'],
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
                'password' => Hash::make('password'),
            ]);

            $user->assignRole('band');
        }
    }
}
