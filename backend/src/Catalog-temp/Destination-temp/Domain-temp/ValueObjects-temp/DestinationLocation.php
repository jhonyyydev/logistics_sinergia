<?php

namespace Src\Catalog\Destination\Domain\ValueObjects;

class DestinationLocation
{
    private string $value;

    public function __construct(string $value)
    {
        if (empty(trim($value))) {
            throw new \InvalidArgumentException("Destination location cannot be empty");
        }
        $this->value = $value;
    }

    public function value(): string
    {
        return $this->value;
    }
}
