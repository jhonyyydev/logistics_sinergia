<?php

namespace Src\Auth\User\Domain\Contracts;

use Src\Auth\User\Domain\Entities\User;

interface UserRepositoryInterface {
    public function findById(int $id): ? User;
    public function save(User $user): void;
}