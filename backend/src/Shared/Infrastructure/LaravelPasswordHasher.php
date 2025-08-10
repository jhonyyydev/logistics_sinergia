<?php

namespace Src\Shared\Infrastructure;

use Src\Shared\Domain\Contracts\PasswordHasherInterface;
use Illuminate\Support\Facades\Hash;

final class LaravelPasswordHasher implements \Src\Shared\Domain\Contracts\PasswordHasherInterface
{
    public function hash(string $plain): string
    {
        return Hash::make($plain);
    }
}
