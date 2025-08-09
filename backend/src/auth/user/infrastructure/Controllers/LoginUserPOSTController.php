<?php

namespace Src\Auth\User\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Auth\User\Infrastructure\Validators\LoginUserRequest;
use Src\Auth\User\Application\LoginUserUseCase;
use DomainException;
use Throwable;

final class LoginUserPOSTController extends Controller
{
    public function __construct(
        private LoginUserUseCase $useCase
    ) {}

    public function __invoke(LoginUserRequest $request)
    {
        try {
            $token = $this->useCase->execute(
                $request->email,
                $request->password
            );

            return response()->json([
                'message' => 'Login successful',
                'token'   => $token
            ], 200);

        } catch (DomainException $e) {
            // Errores esperados del negocio (credenciales inválidas, usuario inactivo, etc.)
            return response()->json([
                'error' => $e->getMessage()
            ], 401);

        } catch (Throwable $e) {
            // Errores inesperados (BD caída, bugs, etc.)
            return response()->json([
                'error' => 'Unexpected error. Please try again later.'
            ], 500);
        }
    }
}
