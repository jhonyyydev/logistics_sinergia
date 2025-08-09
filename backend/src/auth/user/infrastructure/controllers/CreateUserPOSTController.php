<?php

namespace Src\Auth\User\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Auth\User\Infrastructure\Validators\CreateUserRequest;
use Src\Auth\User\Application\CreateUserUseCase;
use Src\Auth\User\Infrastructure\Repositories\EloquentUserRepository;

final class CreateUserPOSTController extends Controller {

    public function store(CreateUserRequest $request) {
        $createUserUseCase = new CreateUserUseCase(new EloquentUserRepository());
        $createUserUseCase->execute(
            $request->id,
            $request->username,
            $request->email
        );
    }
}
