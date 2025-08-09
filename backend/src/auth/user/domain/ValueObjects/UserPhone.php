<?php

namespace Src\Auth\User\Domain\ValueObjects;

final class UserPhone
{
    private ?string $value;

    public function __construct(?string $phone)
    {
        $this->value = $phone ? trim($phone) : null;
        if ($this->value !== null && strlen($this->value) > 20) {
            throw new \InvalidArgumentException('Phone max length is 20 characters.');
        }
    }

    public function value(): ?string
    {
        return $this->value;
    }
}
