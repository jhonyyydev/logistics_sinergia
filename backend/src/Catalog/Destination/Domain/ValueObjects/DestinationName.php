<?php

namespace Src\Catalog\Destination\Domain\ValueObjects;

class DestinationName
{
    private string $value;

    public function __construct(string $value)
    {
        if (strlen(trim($value)) < 3) {
            throw new \InvalidArgumentException("Destination name must be at least 3 characters");
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }
}
