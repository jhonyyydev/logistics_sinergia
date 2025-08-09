<?php

namespace Src\Auth\User\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Auth\User\Infrastructure\Validators\RegisterClientRequest;
use Src\Auth\User\Application\RegisterClientUserUseCase;

final class RegisterClientUserPOSTController extends Controller
{
    public function __construct(
        private RegisterClientUserUseCase $useCase
    ) {}

    public function __invoke(RegisterClientRequest $request)
    {
        $this->useCase->execute(
            $request->name,
            $request->email,
            $request->address,
            $request->phone,
            $request->type,
            $request->password
        );

        return response()->json(['message' => 'Client registered successfully'], 201);
    }
}

