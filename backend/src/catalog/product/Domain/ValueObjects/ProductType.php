<?php

namespace Src\Catalog\Product\Domain\ValueObjects;

class ProductType
{
    private string $value;

    public function __construct(string $value)
    {
        if (strlen(trim($value)) === 0) {
            throw new \InvalidArgumentException("Product type cannot be empty");
        }
        $this->value = strtolower(trim($value));
    }

    public function value(): string
    {
        return $this->value;
    }
}
