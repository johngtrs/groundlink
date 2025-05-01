<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a Band user
        $band = User::factory()->create([
           'name'     => 'Landvmrks',
           'email'    => 'band@example.com',
           'password' => Hash::make('password'),
        ]);
        $band->assignRole('band');

        // Create a Venue user
        $venue = User::factory()->create([
            'name'     => 'Altherax',
            'email'    => 'venue@example.com',
            'password' => Hash::make('password'),
        ]);
        $venue->assignRole('venue');

        // Create other random users (optional)
        // User::factory(5)->create()->each(function ($user) {
        //     $user->assignRole('band');
        // });
    }
}
