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
