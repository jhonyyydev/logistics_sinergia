<?php

use Illuminate\Support\Facades\Route;
use Src\Catalog\Destination\Infrastructure\Controllers\CreateDestinationPOSTController;
use Src\Catalog\Destination\Infrastructure\Controllers\GetAllDestinationsGETController;
use Src\Catalog\Destination\Infrastructure\Controllers\FindDestinationByIdGETController;
use Src\Catalog\Destination\Infrastructure\Controllers\UpdateDestinationPUTController;
use Src\Catalog\Destination\Infrastructure\Controllers\DeleteDestinationDELETEController;

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::get('/list', GetAllDestinationsGETController::class);

    Route::post('/', CreateDestinationPOSTController::class);

    Route::get('/{id}', FindDestinationByIdGETController::class)
        ->middleware('validate.destination.id');

    Route::put('/{id}', UpdateDestinationPUTController::class)
        ->middleware('validate.destination.id');

    Route::delete('/{id}', DeleteDestinationDELETEController::class)
        ->middleware('validate.destination.id');
});
