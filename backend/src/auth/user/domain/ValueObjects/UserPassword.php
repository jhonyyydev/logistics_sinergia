<?php

namespace Src\Auth\User\Domain\ValueObjects;

final class UserPassword
{
    private string $hashed;

    /**
     * The constructor expects a hashed password (domain is not responsible for hashing).
     */
    public function __construct(string $hashedPassword)
    {
        if (strlen($hashedPassword) === 0) {
            throw new \InvalidArgumentException('Password hash cannot be empty.');
        }
        $this->hashed = $hashedPassword;
    }

    public function value(): string
    {
        return $this->hashed;
    }
}
