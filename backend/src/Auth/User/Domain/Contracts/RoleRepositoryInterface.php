<?php

namespace Src\Auth\User\Domain\Contracts;

use Src\Auth\User\Domain\Entities\User;

interface RoleRepositoryInterface
{
    /**
     * Assign a role (by name) to the given domain User.
     */
    public function assignRoleToUser(User $user, string $roleName): void;
}
