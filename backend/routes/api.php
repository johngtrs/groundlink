<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'message' => 'API is working!',
    ]);
});

// Route::middleware('auth:sanctum')->get('/api/user', function (Request $request) {
//     return $request->user();
// });

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
