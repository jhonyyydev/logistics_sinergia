<?php

use Illuminate\Support\Facades\Route;
use Src\auth\user\infrastructure\controllers\RegisterClientUserPOSTController;;
use Src\Auth\User\Infrastructure\Controllers\LoginUserPOSTController;

// Simpele route example
Route::post('/register', RegisterClientUserPOSTController::class);
Route::post('/login', LoginUserPOSTController::class);

//Authenticathed route example
// Route::middleware(['auth:sanctum','activitylog'])->get('/', [ExampleGETController::class, 'index']);


