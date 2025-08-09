<?php

namespace Src\Catalog\Destination\Domain\ValueObjects;

class DestinationType
{
    private string $value;

    public function __construct(string $value)
    {
        $allowed = ['warehouse_land', 'seaport'];
        if (!in_array(strtolower($value), $allowed, true)) {
            throw new \InvalidArgumentException("Invalid destination type: must be 'warehouse_land' or 'seaport'");
        }
        $this->value = strtolower($value);
    }

    public function value(): string
    {
        return $this->value;
    }
}
