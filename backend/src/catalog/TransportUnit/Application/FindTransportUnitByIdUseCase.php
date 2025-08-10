<?php

namespace Src\Catalog\TransportUnit\Application;

use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId;

final class FindTransportUnitByIdUseCase
{
    public function __construct(
        private TransportUnitRepositoryInterface $repository
    ) {}

    public function execute(int $id): ?array
    {
        $transportUnit = $this->repository->findById(new TransportUnitId($id));

        if (!$transportUnit) {
            return null;
        }

        return [
            'id' => $transportUnit->id()->value(),
            'identifier' => $transportUnit->identifier()->value(),
            'type' => $transportUnit->type()->value(),
            'active' => $transportUnit->isActive()->value(),
        ];
    }
}
