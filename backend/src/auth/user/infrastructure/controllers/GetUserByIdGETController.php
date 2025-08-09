<?php

namespace Src\auth\user\infrastructure\controllers;

use App\Http\Controllers\Controller;
use Src\Auth\User\Infrastructure\Repositories\EloquentUserRepository;
use Src\Auth\User\Application\GetUserByIdUseCase;

final class GetUserByIdGETController extends Controller { 
    public function index($id) {
        $GetUserByIdUseCase = new GetUserByIdUseCase(new EloquentUserRepository());
        $user = $GetUserByIdUseCase($id);

        return response()->json([
            'status' => true,
            'data' => $user,
            'message' => 'User retrieved successfully'
        ]);
    }
}