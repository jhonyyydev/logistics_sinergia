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
            $result = $this->useCase->execute(
                $request->email,
                $request->password
            );

            return response()->json([
                'message' => 'Login successful',
                'token'   => $result['token'],
                'user'    => $result['user']
            ], 200);

        } catch (DomainException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 401);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error. Please try again later.'
            ], 500);
        }
    }
}
