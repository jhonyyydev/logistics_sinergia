<?php

namespace Src\Catalog\Client\Domain\ValueObjects;

class ClientId
{
    private int $value;

    public function __construct(int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException("Client ID must be positive");
        }
        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }
}
