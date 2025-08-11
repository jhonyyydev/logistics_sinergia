<?php

namespace Src\Shared\Domain\Contracts;

use Src\Auth\User\Domain\Entities\User;

interface AuthServiceInterface
{
    public function generateToken(User $user): string;
}
