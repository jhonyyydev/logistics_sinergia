<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

use DateTimeImmutable;

final class DeliveryLogDate
{
    private DateTimeImmutable $logDate;

    public function __construct(string $logDate)
    {
        $date = DateTimeImmutable::createFromFormat('Y-m-d', $logDate);

        if (!$date) {
            throw new \InvalidArgumentException('Invalid log date format. Expected Y-m-d.');
        }

        $this->logDate = $date;
    }

    public function value(): DateTimeImmutable
    {
        return $this->logDate;
    }

    public function formatted(): string
    {
        return $this->logDate->format('Y-m-d');
    }
}
