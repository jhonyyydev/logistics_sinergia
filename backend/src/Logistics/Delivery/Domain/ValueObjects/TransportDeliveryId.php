<?php
namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class TransportDeliveryId
{
    private int $value;
    public function __construct(int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException("Invalid delivery id.");
        }
        $this->value = $value;
    }
    public function value(): int
    {
        return $this->value;
    }
}

final class TransportUnitId
{
    private int $value;
    public function __construct(int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException("Invalid transport unit id.");
        }
        $this->value = $value;
    }
    public function value(): int
    {
        return $this->value;
    }
}

final class DestinationId
{
    private int $value;
    public function __construct(int $value)
    {
        if ($value <= 0) {
            throw new \InvalidArgumentException("Invalid destination id.");
        }
        $this->value = $value;
    }
    public function value(): int
    {
        return $this->value;
    }
}
