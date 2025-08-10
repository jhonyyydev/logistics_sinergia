<?php

namespace Src\Catalog\Client\Domain\ValueObjects;

class ClientName
{
    private string $value;

    public function __construct(string $value)
    {
        if (strlen(trim($value)) < 3) {
            throw new \InvalidArgumentException("Client name must be at least 3 characters");
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }
}
