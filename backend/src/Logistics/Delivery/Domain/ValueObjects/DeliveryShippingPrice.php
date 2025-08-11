<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryShippingPrice
{
    public function __construct(private float $price)
    {
        if ($price < 0) throw new \InvalidArgumentException("Shipping price cannot be negative.");
    }
    public function value(): float { return $this->price; }
}
