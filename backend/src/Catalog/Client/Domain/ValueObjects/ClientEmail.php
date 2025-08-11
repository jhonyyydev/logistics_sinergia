<?php

namespace Src\Catalog\Client\Domain\ValueObjects;

class ClientEmail
{
    private string $value;

    public function __construct(string $value)
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("Invalid email format");
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }
}
