<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens;
    use HasFactory;
    use HasRoles;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    /**
     * Get the polymorphic relation to the user type (Band, Venue).
     *
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function typeable()
    {
        return $this->morphTo();
    }

    /**
     * Registers a new user associated with a polymorphic type (band or venue).
     *
     * If a user with the given email already exists, the method returns null.
     * Otherwise, it creates the corresponding Band or Venue model,
     * associates the user to it via a morphOne relation, assigns a role,
     * and returns the newly created user instance.
     *
     * @param array $attributes ['name', 'email', 'password', 'type']
     * @return User|null
     */
    public static function registerWithType(array $attributes): ?User
    {
        // Check if a user with this email already exists
        if (User::where('email', $attributes['email'])->exists()) {
            return null;
        }

        $type = $attributes['type'];

        // Only accept known types
        if (!in_array($type, ['band', 'venue'], true)) {
            return null;
        }

        // Create the related polymorphic model
        $typeModel = match ($type) {
            'band'  => Band::create(['name' => $attributes['name']]),
            'venue' => Venue::create(['name' => $attributes['name']]),
        };

        // Create the user via the polymorphic relation
        $user = $typeModel->user()->create([
            'name'     => $attributes['name'],
            'email'    => $attributes['email'],
            'password' => Hash::make($attributes['password']),
        ]);

        // Assign role based on type
        $user->assignRole($type);

        return $user;
    }

}
