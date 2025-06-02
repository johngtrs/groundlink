<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Band;
use Illuminate\Http\JsonResponse;

class BandController extends Controller
{
    public function index(): JsonResponse
    {
        $bands = Band::with('genres')->get();

        return response()->json($bands);
    }
}
