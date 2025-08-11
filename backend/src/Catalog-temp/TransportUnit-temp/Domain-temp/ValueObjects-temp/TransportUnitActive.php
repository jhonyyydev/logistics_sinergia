<?php

namespace Src\Catalog\TransportUnit\Domain\ValueObjects;

final class TransportUnitActive
{
    private bool $active;

    public function __construct(bool $active)
    {
        $this->active = $active;
    }

    public function value(): bool
    {
        return $this->active;
    }
}
