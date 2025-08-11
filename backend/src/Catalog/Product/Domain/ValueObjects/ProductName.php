<?php

namespace Src\Catalog\Product\Domain\ValueObjects;

class ProductName
{
    private string $value;

    public function __construct(string $value)
    {
        if (strlen(trim($value)) < 3) {
            throw new \InvalidArgumentException("Product name must be at least 3 characters");
        }
        $this->value = trim($value);
    }

    public function value(): string
    {
        return $this->value;
    }
}
