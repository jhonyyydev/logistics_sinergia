<?php

namespace Src\Catalog\TransportUnit\Application;

use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;

final class GetTransportUnitsForSelectUseCase
{
    public function __construct(private TransportUnitRepositoryInterface $repository) {}

    public function execute(): array
    {
        return $this->repository->findAllForSelect();
    }
}
