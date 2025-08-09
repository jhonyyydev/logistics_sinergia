<?php

namespace Src\Catalog\TransportUnit\Domain\ValueObjects;

final class TransportUnitId
{
    private int $id;

    public function __construct(int $id)
    {
        if ($id <= 0) {
            throw new \InvalidArgumentException("Invalid transport unit ID.");
        }
        $this->id = $id;
    }

    public function value(): int
    {
        return $this->id;
    }
}
