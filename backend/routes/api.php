<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Usuario autenticado
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Rutas públicas (auth)
Route::prefix('auth/role')->group(base_path('src/auth/role/infrastructure/routes/api.php'));
Route::prefix('auth/user')->group(base_path('src/auth/user/infrastructure/routes/api.php'));
Route::prefix('auth/permission')->group(base_path('src/auth/permission/infrastructure/routes/api.php'));

// Catalog - Solo admin
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::prefix('catalog/client')->group(base_path('src/catalog/client/infrastructure/routes/api.php'));
    Route::prefix('catalog/destination')->group(base_path('src/catalog/destination/infrastructure/routes/api.php'));
    Route::prefix('catalog/product')->group(base_path('src/catalog/product/infrastructure/routes/api.php'));
    Route::prefix('catalog/transport_unit')->group(base_path('src/catalog/transportunit/infrastructure/routes/api.php'));
});

// Logistics - Admin o Client con permiso
Route::middleware(['auth:sanctum', 'permission:manage-deliveries'])->group(function () {
    Route::prefix('logistics/delivery')->group(base_path('src/logistics/delivery/infrastructure/routes/api.php'));
});
