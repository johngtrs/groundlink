<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'postal_code',
        'country_code', // e.g. FR, DE, US
        'insee_code',
        'siren_code',
        'departement_code',
        'region_code',
        'latitude',
        'longitude',
    ];

    public function bands()
    {
        return $this->hasMany(Band::class);
    }

    public function venues()
    {
        return $this->hasMany(Venue::class);
    }
}
