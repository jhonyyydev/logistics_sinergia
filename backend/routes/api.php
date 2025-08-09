<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth/role')->group(base_path('src/auth/role/infrastructure/routes/api.php'));

Route::prefix('auth/user')->group(base_path('src/auth/user/infrastructure/routes/api.php'));

Route::prefix('auth/permission')->group(base_path('src/auth/permission/infrastructure/routes/api.php'));

Route::prefix('catalog/client')->group(base_path('src/catalog/client/infrastructure/routes/api.php'));

Route::prefix('catalog/destination')->group(base_path('src/catalog/destination/infrastructure/routes/api.php'));

Route::prefix('catalog/product')->group(base_path('src/catalog/product/infrastructure/routes/api.php'));

Route::prefix('catalog/transport_unit')->group(base_path('src/catalog/transport_unit/infrastructure/routes/api.php'));

Route::prefix('logistics/delivery')->group(base_path('src/logistics/delivery/infrastructure/routes/api.php'));

Route::prefix('logistics/guide')->group(base_path('src/logistics/guide/infrastructure/routes/api.php'));

Route::prefix('logistics/pricing')->group(base_path('src/logistics/pricing/infrastructure/routes/api.php'));

Route::prefix('logistics/transport_delivery')->group(base_path('src/logistics/transport_delivery/infrastructure/routes/api.php'));

