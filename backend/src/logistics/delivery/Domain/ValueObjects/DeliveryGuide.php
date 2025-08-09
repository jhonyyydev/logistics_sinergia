<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryGuide
{
    public function __construct(private string $guide)
    {
        if (!preg_match('/^[A-Za-z0-9]{10}$/', $guide)) {
            throw new \InvalidArgumentException("Invalid guide format. Must be 10 alphanumeric characters.");
        }
    }

    public function value(): string
    {
        return $this->guide;
    }
}
