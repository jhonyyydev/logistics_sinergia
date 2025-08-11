<?php

namespace Src\Catalog\Client\Domain\ValueObjects;

class ClientPhone
{
    private string $value;

    public function __construct(string $value)
    {
        if (!preg_match('/^[0-9\-\+\s]{7,20}$/', $value)) {
            throw new \InvalidArgumentException("Invalid phone number");
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }
}
