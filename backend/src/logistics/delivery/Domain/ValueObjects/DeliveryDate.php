<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryDate
{
    public function __construct(private \DateTimeImmutable $date) {}
    public function value(): \DateTimeImmutable { return $this->date; }
}
