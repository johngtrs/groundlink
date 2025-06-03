<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Band;
use App\Services\AvatarService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class BandController extends Controller
{
    public function index(): JsonResponse
    {
        $bands = Band::with('genres')->get();

        return response()->json($bands);
    }

    public function show(Band $band): JsonResponse
    {
        $band->load('genres');

        return response()->json($band);
    }

    public function avatar(Band $band, AvatarService $avatarService)
    {
        return $avatarService->getAvatarResponse('band', $band->id);
    }
}
