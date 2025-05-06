<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SanctumAuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['message' => 'API is working!']));

// Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
//     return $request->user();
// });

// SanctumAuthController
Route::post('/login', [SanctumAuthController::class, 'login']);
Route::post('/logout', [SanctumAuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user', [SanctumAuthController::class, 'user']);

// RegisterController
Route::post('/register', [RegisterController::class, 'register']);
