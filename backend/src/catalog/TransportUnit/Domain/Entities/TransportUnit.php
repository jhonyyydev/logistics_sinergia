<?php

namespace Src\Catalog\TransportUnit\Domain\Entities;

use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitIdentifier;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitType;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitActive;

final class TransportUnit
{
    private TransportUnitId $id;
    private TransportUnitIdentifier $identifier;
    private TransportUnitType $type;
    private TransportUnitActive $active;

    public function __construct(
        TransportUnitId $id,
        TransportUnitIdentifier $identifier,
        TransportUnitType $type,
        TransportUnitActive $active
    ) {
        $this->id = $id;
        $this->identifier = $identifier;
        $this->type = $type;
        $this->active = $active;
    }

    public function id(): TransportUnitId
    {
        return $this->id;
    }

    public function identifier(): TransportUnitIdentifier
    {
        return $this->identifier;
    }

    public function type(): TransportUnitType
    {
        return $this->type;
    }

    public function isActive(): TransportUnitActive
    {
        return $this->active;
    }

    public function deactivate(): void
    {
        $this->active = new TransportUnitActive(false);
    }
}
