<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'capacity',
        'website',
        'formatted_address',
        'address',
        'city',
        'postal_code',
        'country',
        'country_code',
        'region',
        'department',
        'lat',
        'lng',
        'place_id',
    ];

    public function user()
    {
        return $this->morphOne(User::class, 'typeable');
    }
}
