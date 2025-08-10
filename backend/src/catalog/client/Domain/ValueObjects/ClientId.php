<?php

namespace Src\Catalog\Client\Domain\ValueObjects;

use InvalidArgumentException;

final class ClientId
{
    private int $value;

    public function __construct(mixed $value)
    {
        if (!is_numeric($value)) {
            throw new InvalidArgumentException("Client ID must be a number");
        }

        if (intval($value) != $value) {
            throw new InvalidArgumentException("Client ID must be an integer");
        }

        $value = intval($value);

        if ($value <= 0) {
            throw new InvalidArgumentException("Client ID must be positive");
        }

        if ($value > PHP_INT_MAX) {
            throw new InvalidArgumentException("Client ID is too large");
        }

        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }
}

