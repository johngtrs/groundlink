<?php

use App\Http\Controllers\Auth\SanctumAuthController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['message' => 'WEB is working!']));

Route::get('/', function () {
    return view('welcome');
});

// Routes Sanctum SPA
Route::post('/login', [SanctumAuthController::class, 'login']);
Route::post('/logout', [SanctumAuthController::class, 'logout']);
