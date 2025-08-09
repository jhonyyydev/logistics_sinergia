<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryQuantity
{
    public function __construct(private int $quantity)
    {
        if ($quantity <= 0) throw new \InvalidArgumentException("Quantity must be greater than 0.");
    }
    public function value(): int { return $this->quantity; }
}
