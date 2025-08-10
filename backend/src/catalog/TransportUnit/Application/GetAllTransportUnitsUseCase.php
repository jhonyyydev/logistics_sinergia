<?php

namespace Src\Catalog\TransportUnit\Application;

use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;

final class GetAllTransportUnitsUseCase
{
    public function __construct(
        private TransportUnitRepositoryInterface $repository
    ) {}

    public function execute(): array
    {
        $units = $this->repository->findAll();

        return array_map(fn($unit) => [
            'id' => $unit->id()->value(),
            'identifier' => $unit->identifier()->value(),
            'type' => $unit->type()->value(),
            'active' => $unit->isActive()->value(),
        ], $units);
    }
}
