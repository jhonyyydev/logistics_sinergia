<?php

namespace Src\Catalog\Destination\Domain\ValueObjects;

class DestinationId
{
    private int $value;

    public function __construct(int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException("Destination ID must be positive");
        }
        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }
}
