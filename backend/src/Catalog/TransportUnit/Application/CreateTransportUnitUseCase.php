<?php

namespace Src\Catalog\TransportUnit\Application;

use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;
use Src\Catalog\TransportUnit\Domain\Entities\TransportUnit;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitIdentifier;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitType;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitActive;
use Src\Shared\Domain\Contracts\TransportUnitIdGeneratorInterface;

final class CreateTransportUnitUseCase
{
    public function __construct(
        private TransportUnitRepositoryInterface $repository,
        private TransportUnitIdGeneratorInterface $idGenerator
    ) {}

    public function execute(string $identifier, string $type, bool $active): void
    {
        $rawId = $this->idGenerator->generate();
        $id = new TransportUnitId($rawId);

        $transportUnit = new TransportUnit(
            $id,
            new TransportUnitIdentifier($identifier, $type),
            new TransportUnitType($type),
            new TransportUnitActive($active)
        );

        $this->repository->save($transportUnit);
    }
}
