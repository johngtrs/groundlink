<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venue extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'capacity', 'city_id'];

    public function user()
    {
        return $this->morphOne(User::class, 'typeable');
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
