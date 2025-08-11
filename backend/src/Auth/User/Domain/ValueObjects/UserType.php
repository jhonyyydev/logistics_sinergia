<?php

namespace Src\Auth\User\Domain\ValueObjects;

final class UserType
{
    private ?string $value;

    public function __construct(?string $type)
    {
        $allowed = ['national', 'international', null];
        // Accept null or values you expect; normalize if needed
        if ($type !== null && !in_array(strtolower($type), ['national', 'international'], true)) {
            throw new \InvalidArgumentException('Invalid user type.');
        }
        $this->value = $type ? strtolower($type) : null;
    }

    public function value(): ?string
    {
        return $this->value;
    }
}
