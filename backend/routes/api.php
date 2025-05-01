<?php

use App\Http\Controllers\Auth\SanctumAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['message' => 'API is working!']));

// Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:sanctum')->get('/user', [SanctumAuthController::class, 'user']);
