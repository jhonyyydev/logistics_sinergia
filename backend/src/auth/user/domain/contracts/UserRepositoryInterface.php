<?php

namespace Src\Auth\User\Domain\Contracts;

use Src\Auth\User\Domain\Entities\User;
use Src\Auth\User\Domain\ValueObjects\UserId;

interface UserRepositoryInterface
{
    public function save(User $user): void;

    public function findById(UserId $id): ?User;

    public function findByEmail(string $email): ?User;
}
