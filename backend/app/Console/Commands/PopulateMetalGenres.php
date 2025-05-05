<?php

namespace App\Console\Commands;

use App\Models\Genre;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class PopulateMetalGenres extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:populate-metal-genres';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate the genres table with various metal subgenres';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $genres = config('metal_genres');

        $createdCount = 0;

        foreach ($genres as $genreName) {
            $slug = Str::slug($genreName);

            if (!Genre::where('slug', $slug)->exists()) {
                Genre::create([
                    'name' => $genreName,
                    'slug' => $slug
                ]);

                $this->info("Inserted: {$genreName} ({$slug})");
                $createdCount++;
            }
        }

        $this->info("✅ {$createdCount} genres successfully inserted.");
        return Command::SUCCESS;
    }
}
