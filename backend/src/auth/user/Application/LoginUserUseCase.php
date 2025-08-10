<?php

namespace Src\Auth\User\Application;

use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Shared\Domain\Contracts\AuthServiceInterface;
use Illuminate\Support\Facades\Hash;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use DomainException;

final class LoginUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private AuthServiceInterface $authService
    ) {}

    public function execute(string $email, string $password): string
    {
        $emailVo = new UserEmail($email);
        $user = $this->userRepository->findByEmail($emailVo->value());

        if (!$user) {
            throw new DomainException('User not found.');
        }

        // validate password
        if (!Hash::check($password, $user->password()->value())) {
            throw new DomainException('Invalid credentials.');
        }

        // generate token
        return $this->authService->generateToken($user);
    }
}
