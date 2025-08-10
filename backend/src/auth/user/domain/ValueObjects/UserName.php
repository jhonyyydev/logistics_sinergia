<?php

namespace Src\Auth\User\Domain\ValueObjects;

class UserName {
    private string $name;

    public function __construct(string $name) {
        if (strlen($name) < 3) {
            throw new \InvalidArgumentException('User name must be at least 3 characters.');
        }

        $this->name = $name;
    }

    public function value(): string {
        return $this->name;
    }
}