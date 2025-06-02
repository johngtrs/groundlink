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
        if (User::count() > 0) {
            return;
        }

        // Register a band user
        User::registerWithType([
            'name'     => 'Band',
            'email'    => 'band@example.com',
            'password' => 'password',
            'type'     => 'band',
        ]);

        // Register a venue user
        User::registerWithType([
            'name'     => 'Venue',
            'email'    => 'venue@example.com',
            'password' => 'password',
            'type'     => 'venue',
        ]);
    }
}
