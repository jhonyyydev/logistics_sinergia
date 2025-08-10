<?php

namespace Src\Catalog\TransportUnit\Application;

use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;
use Src\Catalog\TransportUnit\Domain\Entities\TransportUnit;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitIdentifier;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitType;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitActive;

final class UpdateTransportUnitUseCase
{
    public function __construct(
        private TransportUnitRepositoryInterface $repository
    ) {}

    public function execute(int $id, ?string $identifier, ?string $type, ?bool $active): void
    {
        $transportUnitId = new TransportUnitId($id);
        $existing = $this->repository->findById($transportUnitId);

        if (!$existing) {
            throw new \InvalidArgumentException("Transport unit not found");
        }

        $updatedTransportUnit = new TransportUnit(
            $transportUnitId,
            new TransportUnitIdentifier($identifier ?? $existing->identifier()->value(), $type ?? $existing->type()->value()),
            new TransportUnitType($type ?? $existing->type()->value()),
            new TransportUnitActive($active ?? $existing->isActive()->value())
        );

        $this->repository->update($updatedTransportUnit);
    }
}
