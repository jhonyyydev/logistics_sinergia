<?php

namespace Src\Catalog\Client\Domain\ValueObjects;

class ClientAddress
{
    private string $value;

    public function __construct(string $value)
    {
        if (empty(trim($value))) {
            throw new \InvalidArgumentException("Client address cannot be empty");
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }
}
