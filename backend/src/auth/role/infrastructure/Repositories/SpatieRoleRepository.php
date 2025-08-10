<?php

namespace Src\Auth\Role\Infrastructure\Repositories;

use Src\Auth\User\Domain\Contracts\RoleRepositoryInterface;
use Src\Auth\User\Domain\Entities\User;
use App\Models\User as EloquentUser;
use Spatie\Permission\Models\Role;

final class SpatieRoleRepository implements RoleRepositoryInterface
{
    public function assignRoleToUser(User $user, string $roleName): void
    {
        // Ensure role exists (firstOrCreate)
        Role::firstOrCreate(['name' => $roleName]);

        // Find Eloquent user by id
        $eloquentUser = EloquentUser::find($user->id()->value());
        if (!$eloquentUser) {
            throw new \RuntimeException("Eloquent user not found when assigning role.");
        }

        $eloquentUser->assignRole($roleName);
    }
}
