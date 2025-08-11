<?php

namespace Src\Auth\User\Application;

use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Shared\Domain\Contracts\AuthServiceInterface;
use Illuminate\Support\Facades\Hash;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use DomainException;
use App\Models\User as EloquentUser;

final class LoginUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private AuthServiceInterface $authService
    ) {}

    public function execute(string $email, string $password): array
    {
        $emailVo = new UserEmail($email);

        $eloquentUser = EloquentUser::where('email', $emailVo->value())->first();

        if (!$eloquentUser) {
            throw new DomainException('User not found.');
        }

        if (!Hash::check($password, $eloquentUser->password)) {
            throw new DomainException('Invalid credentials.');
        }

        // Generar token con Sanctum
        $token = $eloquentUser->createToken('auth_token')->plainTextToken;

        return [
            'token' => $token,
            'user' => [
                'id' => $eloquentUser->id,
                'name' => $eloquentUser->name,
                'email' => $eloquentUser->email,
                'roles' => $eloquentUser->getRoleNames()->toArray(),
                'permissions' => $eloquentUser->getAllPermissions()->pluck('name')->toArray(),
            ]
        ];
    }
}
