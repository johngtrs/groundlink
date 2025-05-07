<?php

use Illuminate\Support\Facades\Route;

Route::get('/ping', fn () => response()->json(['message' => 'WEB is working!']));

Route::get('/', function () {
    return view('welcome');
});
