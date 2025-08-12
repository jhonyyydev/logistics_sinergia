<?php

use Illuminate\Support\Facades\Route;
use Src\Catalog\TransportUnit\Infrastructure\Controllers\CreateTransportUnitPOSTController;
use Src\Catalog\TransportUnit\Infrastructure\Controllers\GetAllTransportUnitsGETController;
use Src\Catalog\TransportUnit\Infrastructure\Controllers\FindTransportUnitByIdGETController;
use Src\Catalog\TransportUnit\Infrastructure\Controllers\UpdateTransportUnitPUTController;
use Src\Catalog\TransportUnit\Infrastructure\Controllers\DeactivateTransportUnitDELETEController;
use Src\Catalog\TransportUnit\Infrastructure\Controllers\GetTransportUnitsForSelectGETController;

Route::middleware(['auth:sanctum', 'role:client|admin'])->group(function () {
    Route::get('/select', GetTransportUnitsForSelectGETController::class);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::get('/list', GetAllTransportUnitsGETController::class);

    Route::post('/', CreateTransportUnitPOSTController::class);

    Route::get('/{id}', FindTransportUnitByIdGETController::class)
        ->middleware('validate.transport.id');

    Route::put('/{id}', UpdateTransportUnitPUTController::class)
        ->middleware('validate.transport.id');

    Route::delete('/{id}', DeactivateTransportUnitDELETEController::class)
        ->middleware('validate.transport.id');
});

