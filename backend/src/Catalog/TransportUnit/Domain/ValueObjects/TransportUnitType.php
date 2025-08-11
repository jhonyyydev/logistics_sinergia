<?php

namespace Src\Catalog\TransportUnit\Domain\ValueObjects;

final class TransportUnitType
{
    private string $type;

    public function __construct(string $type)
    {
        $validTypes = ['fleet', 'vehicle'];

        if (!in_array($type, $validTypes, true)) {
            throw new \InvalidArgumentException("Invalid transport unit type.");
        }

        $this->type = $type;
    }

    public function value(): string
    {
        return $this->type;
    }
}
