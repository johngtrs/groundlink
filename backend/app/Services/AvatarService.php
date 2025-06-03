<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class AvatarService
{
    public function getAvatarResponse(string $type, int $id)
    {
        $path = "{$type}_{$id}/avatar/avatar.jpg";

        if (!Storage::disk('private')->exists($path)) {
            return response()->json(['message' => 'Avatar non trouvé'], 204);
        }

        return response()->file(Storage::disk('private')->path($path));
    }
}
