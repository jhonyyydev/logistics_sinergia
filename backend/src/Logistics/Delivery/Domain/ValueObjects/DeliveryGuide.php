<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryGuide {
    public function __construct(private string $value) {
        if (!preg_match('/^[A-Za-z0-9]{10}$/', $value)) {
            throw new \InvalidArgumentException("Guide must be alphanumeric and 10 characters long");
        }
    }
    public function value(): string { return $this->value; }
}
