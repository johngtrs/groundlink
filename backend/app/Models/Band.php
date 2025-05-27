<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Band extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'spotify',
        'website',
        'formatted_address',
        'city',
        'postal_code',
        'country',
        'region',
        'department',
        'lat',
        'lng',
        'place_id',
    ];

    protected $with = ['genres'];

    public function user()
    {
        return $this->morphOne(User::class, 'typeable');
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class);
    }
}
