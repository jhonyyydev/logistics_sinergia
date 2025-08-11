<?php

namespace Src\Catalog\TransportUnit\Domain\ValueObjects;

final class TransportUnitIdentifier
{
    private string $identifier;

    public function __construct(string $identifier, string $type)
    {
        if ($type === 'fleet') {
            if (!preg_match('/^[A-Z]{3}[0-9]{4}[A-Z]$/', $identifier)) {
                throw new \InvalidArgumentException("Invalid fleet number format.");
            }
        } elseif ($type === 'vehicle') {
            if (!preg_match('/^[A-Z]{3}[0-9]{3}$/', $identifier)) {
                throw new \InvalidArgumentException("Invalid vehicle plate format.");
            }
        } else {
            throw new \InvalidArgumentException("Unknown transport unit type.");
        }

        $this->identifier = strtoupper($identifier);
    }

    public function value(): string
    {
        return $this->identifier;
    }
}
