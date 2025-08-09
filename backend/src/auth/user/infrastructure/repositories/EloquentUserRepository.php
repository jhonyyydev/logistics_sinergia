<?php

namespace Src\Auth\User\Infrastructure\Repositories;

use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Domain\Entities\User;
Use Src\Auth\User\Domain\ValueObjects\UserName;
Use Src\Auth\User\Domain\ValueObjects\UserEmail;
use App\Models\User as EloquentUser;

class EloquentUserRepository implements UserRepositoryInterface {
    public function findById(int $id): ? User {
        $user = EloquentUser::find($id);
        if (!$user) {
            return null;
        }

        return new User(
            $user->id,
            new UserName($user->name),
            new UserEmail($user->email),
        );
    }

    public function save(User $user): void {
        EloquentUser::updateOrCreate(
            ['id' => $user->id()],
            [
                'name' => $user->name()->value(),
                'email' => $user->email()->value(),
            ]
        );
    }
}
