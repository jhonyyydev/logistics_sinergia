<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Usuario autenticado
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas públicas (auth)
Route::prefix('auth/role')->group(base_path('src/Auth/Role/Infrastructure/Routes/api.php'));
Route::prefix('auth/user')->group(base_path('src/Auth/User/Infrastructure/Routes/api.php'));
Route::prefix('auth/permission')->group(base_path('src/Auth/Permission/Infrastructure/Routes/api.php'));

// Catalog - Solo admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::prefix('catalog/client')->group(base_path('src/Catalog/Client/Infrastructure/Routes/api.php'));
    Route::prefix('catalog/destination')->group(base_path('src/Catalog/Destination/Infrastructure/Routes/api.php'));
    Route::prefix('catalog/product')->group(base_path('src/Catalog/Product/Infrastructure/Routes/api.php'));
    Route::prefix('catalog/transport/')->group(base_path('src/Catalog/TransportUnit/Infrastructure/Routes/api.php'));
});

// Logistics - Admin o Client con permiso
Route::middleware(['auth:sanctum', 'permission:manage-deliveries'])->group(function () {
    Route::prefix('logistic/delivery')->group(base_path('src/Logistics/Delivery/Infrastructure/Routes/api.php'));
});
