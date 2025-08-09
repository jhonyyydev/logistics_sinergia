<?php

use Illuminate\Support\Facades\Route;
use Src\auth\user\infrastructure\controllers\CreateUserPOSTController;
use Src\auth\user\infrastructure\controllers\GetUserByIdGETController;;

// Simpele route example
Route::get('/{id}', [GetUserByIdGETController::class, 'index']);
Route::post('/store', [CreateUserPOSTController::class, 'store']);

//Authenticathed route example
// Route::middleware(['auth:sanctum','activitylog'])->get('/', [ExampleGETController::class, 'index']);
