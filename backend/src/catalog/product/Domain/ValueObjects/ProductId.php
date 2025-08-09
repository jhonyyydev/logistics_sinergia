<?php

namespace Src\Catalog\Product\Domain\ValueObjects;

class ProductId
{
    private int $value;

    public function __construct(int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException("Product ID must be positive");
        }
        $this->value = $value;
    }

    public function value(): int
    {
        return $this->value;
    }
}
