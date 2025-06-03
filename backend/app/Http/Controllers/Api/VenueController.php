<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venue;
use App\Services\AvatarService;
use Illuminate\Http\JsonResponse;

class VenueController extends Controller
{
    public function index(): JsonResponse
    {
        $venues = Venue::all();

        return response()->json($venues);
    }

    public function show(Venue $venue): JsonResponse
    {
        return response()->json($venue);
    }

    public function avatar(Venue $venue, AvatarService $avatarService)
    {
        return $avatarService->getAvatarResponse('venue', $venue->id);
    }
}
