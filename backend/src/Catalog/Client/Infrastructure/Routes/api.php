<?php

use Illuminate\Support\Facades\Route;
use Src\Catalog\Client\Infrastructure\Controllers\GetAllClientsGETController;
use Src\Catalog\Client\Infrastructure\Controllers\FindClientByIdGETController;
use Src\Catalog\Client\Infrastructure\Controllers\UpdateClientPUTController;
use Src\Catalog\Client\Infrastructure\Controllers\DeactivateClientDELETEController;

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/list', GetAllClientsGETController::class);

    Route::get('/{id}', FindClientByIdGETController::class)
        ->middleware('validate.client.id');

    Route::put('/{id}', UpdateClientPUTController::class)
        ->middleware('validate.client.id');

    Route::delete('/{id}', DeactivateClientDELETEController::class)
        ->middleware('validate.client.id');
});
