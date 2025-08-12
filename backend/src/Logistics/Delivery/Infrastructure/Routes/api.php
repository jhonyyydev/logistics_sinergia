<?php

//use Src\logistics\delivery\infrastructure\controllers\ExampleGETController;

// Simpele route example

use Illuminate\Support\Facades\Route;
use Src\Logistics\Delivery\Infrastructure\Controllers\CreateDeliveryWithTransportPOSTController;
use Src\Logistics\Delivery\Infrastructure\Controllers\GetAllDeliveriesWithRelationsGETController;

Route::middleware(['auth:sanctum', 'role:client'])->group(function () {
    Route::post('/', CreateDeliveryWithTransportPOSTController::class);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/list', GetAllDeliveriesWithRelationsGETController::class);
});

