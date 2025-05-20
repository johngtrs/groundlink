<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ImageConverter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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
            'name'                  => ['required', 'string', 'max:255'],
            'profilePicture'        => ['nullable', 'url', 'max:2048'],
            'description'           => ['nullable', 'string', 'max:2000'],
            // Band
            'genres'          => ['nullable', 'array'],
            'spotify'         => ['nullable', 'url', 'max:2048'],
            // Venue
            'website'               => ['nullable', 'url', 'max:2048'],
            'address'               => ['nullable', 'string', 'max:255'],
            'city'                  => ['nullable', 'string', 'max:255'],
            'capacity'              => ['nullable', 'integer', 'min:0'],
        ]);

        $user->update(['name' => $validated['name']]);

        if ($user->type === 'band' && isset($validated['genres'])) {
            $user->typeable->genres()->sync($validated['genres']);
            unset($validated['genres']);
        }

        // Update the related polymorphic model
        $user->typeable->update($validated);

        return response()->json($user->fresh()->load('typeable'));
    }

    public function getAvatar(Request $request)
    {
        $user = $request->user();
        $type = $user->type;
        $typeableId = $user->typeable->id;
        $folder = "{$type}_{$typeableId}/avatar";

        $files = Storage::disk('private')->files($folder);
        $avatarFile = collect($files)->first();

        if (!$avatarFile || !Storage::disk('private')->exists($avatarFile)) {
            return response()->json(['message' => 'Avatar non trouvé'], 204);
        }

        return response()->file(Storage::disk('private')->path($avatarFile));
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $type = $user->type;
        $typeableId = $user->typeable->id;

        $extension = $request->file('avatar')->extension();
        $folder = "{$type}_{$typeableId}/avatar";
        $filename = "avatar.{$extension}";

        if (Storage::disk('private')->exists($folder)) {
            $files = Storage::disk('private')->files($folder);
            foreach ($files as $file) {
                Storage::disk('private')->delete($file);
            }
        }

        $request->file('avatar')->storeAs($folder, $filename, 'private');

        return response()->json(['message' => 'Avatar updated']);
    }

    public function deleteAvatar(Request $request)
    {
        $user = $request->user();
        $type = $user->type;
        $typeableId = $user->typeable->id;
        $folder = "{$type}_{$typeableId}/avatar";

        if (Storage::disk('private')->exists($folder)) {
            $files = Storage::disk('private')->files($folder);
            foreach ($files as $file) {
                Storage::disk('private')->delete($file);
            }
        }

        return response()->json(['message' => 'Avatar deleted']);
    }

}
