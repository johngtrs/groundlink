<?php

namespace App\Console\Commands;

use App\Models\City;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class PopulateCities extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:populate-cities';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Populate the cities table with French communes from geo.api.gouv.fr';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Fetching French cities from geo.api.gouv.fr...');

        $response = Http::get('https://geo.api.gouv.fr/communes', [
            'fields'   => 'nom,code,codesPostaux,siren,codeDepartement,codeRegion,centre',
            'geometry' => 'centre',
            'format'   => 'json',
        ]);

        if ($response->failed()) {
            $this->error('❌ Failed to fetch data from geo.api.gouv.fr.');
            return Command::FAILURE;
        }

        $cities = $response->json();
        $insertData = [];

        foreach ($cities as $data) {
            if (empty($data['nom']) || empty($data['codesPostaux']) || empty($data['code'])) {
                continue;
            }

            foreach ($data['codesPostaux'] as $postal) {
                $insertData[] = [
                    'name'             => $data['nom'],
                    'postal_code'      => $postal,
                    'country_code'     => 'FR',
                    'insee_code'       => $data['code'],
                    'siren_code'       => $data['siren'] ?? null,
                    'departement_code' => $data['codeDepartement'] ?? null,
                    'region_code'      => $data['codeRegion'] ?? null,
                    'latitude'         => Arr::get($data, 'centre.coordinates.1') ?? null,
                    'longitude'        => Arr::get($data, 'centre.coordinates.0') ?? null,
                ];
            }
        }

        $this->info('📥 Inserting data...');
        collect($insertData)->chunk(1000)->each(function ($chunk) {
            City::upsert(
                $chunk->toArray(),
                ['insee_code', 'postal_code'],
                [
                    'name',
                    'country_code',
                    'siren_code',
                    'departement_code',
                    'region_code',
                    'latitude',
                    'longitude',
                    'updated_at',
                ]
            );
        });

        $this->info('✅ Cities upserted successfully.');
        return Command::SUCCESS;
    }
}
