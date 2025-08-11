<?php

namespace Src\Auth\User\Domain\ValueObjects;

final class UserAddress
{
    private ?string $value;

    public function __construct(?string $address)
    {
        $this->value = $address ? trim($address) : null;
    }

    public function value(): ?string
    {
        return $this->value;
    }
}
