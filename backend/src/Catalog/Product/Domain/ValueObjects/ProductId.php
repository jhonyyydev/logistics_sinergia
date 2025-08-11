<?php

namespace Src\Catalog\Product\Domain\ValueObjects;

use InvalidArgumentException;

class ProductId
{
    private int $value;

    public function __construct(mixed $value)
    {
        if (!is_numeric($value)) {
            throw new InvalidArgumentException("Product ID must be a number");
        }

        if (intval($value) != $value) {
            throw new InvalidArgumentException("Product ID must be an integer");
        }

        $value = intval($value);

        if ($value <= 0) {
            throw new InvalidArgumentException("Product ID must be positive");
        }

        if ($value > PHP_INT_MAX) {
            throw new InvalidArgumentException("Product ID is too large");
        }

        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }
}
