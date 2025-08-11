<?php

namespace Src\Shared\Infrastructure;

use Src\Shared\Domain\Contracts\AuthServiceInterface;
use Src\Auth\User\Domain\Entities\User;
use App\Models\User as EloquentUser;

final class LaravelAuthService implements AuthServiceInterface
{
    public function generateToken(User $user): string
    {
        $eloquentUser = EloquentUser::findOrFail($user->id()->value());
        return $eloquentUser->createToken('auth_token')->plainTextToken;
    }
}
