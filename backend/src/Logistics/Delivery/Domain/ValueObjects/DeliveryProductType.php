<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryProductType
{
    private const ALLOWED_TYPES = ['electronics', 'clothing', 'food', 'furniture', 'books', 'toys'];
    public function __construct(private string $type)
    {
        if (!in_array($type, self::ALLOWED_TYPES, true)) {
            throw new \InvalidArgumentException("Invalid product type: $type");
        }
    }

    public function value(): string
    {
        return $this->type;
    }
}
