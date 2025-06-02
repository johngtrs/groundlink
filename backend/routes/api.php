<?php

use App\Http\Controllers\Api\BandController;
use App\Http\Controllers\Api\GenreController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\VenueController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\SanctumAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['message' => 'API is working!']));

// SanctumAuthController
Route::post('/login', [SanctumAuthController::class, 'login']);
Route::post('/logout', [SanctumAuthController::class, 'logout']);

// RegisterController
Route::post('/register', [RegisterController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [SanctumAuthController::class, 'user']);

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::get('/profile/avatar', [ProfileController::class, 'getAvatar']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);
    Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar']);

    Route::get('/genres', [GenreController::class, 'index']);
});

Route::get('/bands/{band}', [BandController::class, 'show']);
Route::get('/bands', [BandController::class, 'index']);

Route::get('/venues/{venue}', [VenueController::class, 'show']);
Route::get('/venues', [VenueController::class, 'index']);
