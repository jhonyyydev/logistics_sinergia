<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryStatus
{
    private const VALID = ['pending', 'in_transit', 'delivered', 'cancelled'];

    public function __construct(private string $status)
    {
        if (!in_array($status, self::VALID, true)) {
            throw new \InvalidArgumentException("Invalid delivery status.");
        }
    }
    public function value(): string { return $this->status; }
}
