<?php

use Illuminate\Support\Facades\Route;
use Src\Catalog\Product\Infrastructure\Controllers\CreateProductPOSTController;
use Src\Catalog\Product\Infrastructure\Controllers\GetAllProductsGETController;
use Src\Catalog\Product\Infrastructure\Controllers\FindProductByIdGETController;
use Src\Catalog\Product\Infrastructure\Controllers\UpdateProductPUTController;
use Src\Catalog\Product\Infrastructure\Controllers\DeleteProductDELETEController;
use Src\Catalog\Product\Infrastructure\Controllers\GetProductsForSelectGETController;

Route::middleware(['auth:sanctum', 'role:client|admin'])->group(function () {
    Route::get('/select', GetProductsForSelectGETController::class);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {

    Route::get('/list', GetAllProductsGETController::class);

    Route::post('/', CreateProductPOSTController::class);

    Route::get('/{id}', FindProductByIdGETController::class)
        ->middleware('validate.product.id');

    Route::put('/{id}', UpdateProductPUTController::class)
        ->middleware('validate.product.id');

    Route::delete('/{id}', DeleteProductDELETEController::class)
        ->middleware('validate.product.id');
});
