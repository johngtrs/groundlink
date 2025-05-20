<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

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
        $path = $this->getAvatarPath($user->type, $user->typeable->id);

        if (!Storage::disk('private')->exists($path)) {
            return response()->json(['message' => 'Avatar non trouvé'], 204);
        }

        return response()->file(Storage::disk('private')->path($path));
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();
        $type = $user->type;

        $path = $this->getAvatarPath($type, $user->typeable->id);

        // JPG convert
        $image = Image::read($request->file('avatar'))->toJpeg(85);

        Storage::disk('private')->put($path, $image);

        return response()->json(['message' => 'Avatar mis à jour']);
    }

    public function deleteAvatar(Request $request)
    {
        $user = $request->user();
        $path = $this->getAvatarPath($user->type, $user->typeable->id);

        if (Storage::disk('private')->exists($path)) {
            Storage::disk('private')->delete($path);
        }

        return response()->json(['message' => 'Avatar supprimé']);
    }

    private function getAvatarPath(string $type, int $id): string
    {
        return "{$type}_{$id}/avatar/avatar.jpg";
    }
}
