<?php

namespace Src\Shared\Domain\Contracts;

interface PasswordHasherInterface
{
    public function hash(string $plain): string;
}
