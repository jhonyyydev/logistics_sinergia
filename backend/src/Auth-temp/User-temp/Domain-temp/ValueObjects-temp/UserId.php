<?php

namespace Src\Auth\User\Domain\ValueObjects;

final class UserId
{
    private int $value;

    public function __construct(int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException('UserId must be positive integer.');
        }
        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }
}
