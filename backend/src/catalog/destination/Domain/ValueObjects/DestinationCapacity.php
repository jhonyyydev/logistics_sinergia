<?php

namespace Src\Catalog\Destination\Domain\ValueObjects;

class DestinationCapacity
{
    private int $value;

    public function __construct(int $value)
    {
        if ($value < 0) {
            throw new \InvalidArgumentException("Destination capacity cannot be negative");
        }
        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }
}
