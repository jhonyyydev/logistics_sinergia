<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryUserId {
    public function __construct(private int $value) {
        if ($value <= 0) throw new \InvalidArgumentException("Invalid User ID");
    }
    public function value(): int { return $this->value; }
}
