<?php

namespace Src\Catalog\Product\Domain\ValueObjects;

class ProductDescription
{
    private string $value;

    public function __construct(string $value)
    {
        if (strlen(trim($value)) === 0) {
            throw new \InvalidArgumentException("Product description cannot be empty");
        }
        $this->value = trim($value);
    }

    public function value(): string
    {
        return $this->value;
    }
}
