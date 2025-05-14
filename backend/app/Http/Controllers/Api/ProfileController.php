<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Return the authenticated user's profile, including the polymorphic typeable relation.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request)
    {
        $user = $request->user()->load('typeable');

        return response()->json($user);
    }

    /**
     * Update the authenticated user's profile and its related model (Band or Venue).
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'           => ['string', 'max:255'],
            'profilePicture' => ['nullable', 'url', 'max:2048'],
            // Band
            'genre'          => ['nullable', 'string', 'max:255'],
            'spotify'        => ['nullable', 'url', 'max:2048'],
            // Venue
            'website'        => ['nullable', 'url', 'max:2048'],
            'address'        => ['nullable', 'string', 'max:255'],
            'city'           => ['nullable', 'string', 'max:255'],
            'capacity'       => ['nullable', 'integer', 'min:0'],
        ]);

        // $user->update([
        //     'profilePicture' => $validated['profilePicture'] ?? $user->profilePicture,
        // ]);

        // Update the related polymorphic model
        $user->typeable->update(array_filter([
            'name'           => $validated['name'] ?? $user->name,
            'genre'          => $validated['genre'] ?? null,
            'spotify'        => $validated['spotify'] ?? null,
            'website'        => $validated['website'] ?? null,
            'address'        => $validated['address'] ?? null,
            'city'           => $validated['city'] ?? null,
            'capacity'       => $validated['capacity'] ?? null,
        ]));

        return response()->json($user->fresh()->load('typeable'));
    }
}
