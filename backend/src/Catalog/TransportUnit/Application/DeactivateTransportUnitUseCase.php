<?php

namespace Src\Catalog\TransportUnit\Application;

use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId;

final class DeactivateTransportUnitUseCase
{
    public function __construct(
        private TransportUnitRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $transportUnitId = new TransportUnitId($id);

        $unit = $this->repository->findById($transportUnitId);

        if (!$unit) {
            throw new \InvalidArgumentException("Transport Unit not found");
        }

        $unit->toggleActive();

        $this->repository->update($unit);
    }
}
