<?php

use Illuminate\Support\Facades\Route;
use Src\Auth\User\Infrastructure\Controllers\RegisterClientUserPOSTController;;
use Src\Auth\User\Infrastructure\Controllers\LoginUserPOSTController;

// Simpele route example
Route::post('/register', RegisterClientUserPOSTController::class);
Route::post('/login', LoginUserPOSTController::class)->middleware('throttle:login');

//Authenticathed route example
// Route::middleware(['auth:sanctum','activitylog'])->get('/', [ExampleGETController::class, 'index']);


