<?php

namespace Src\Catalog\TransportUnit\Domain\Contracts;

use Src\Catalog\TransportUnit\Domain\Entities\TransportUnit;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId;

interface TransportUnitRepositoryInterface
{
    public function save(TransportUnit $transportUnit): void;

    public function update(TransportUnit $transportUnit): void;

    public function findById(TransportUnitId $id): ?TransportUnit;

    public function findAll(): array;

    public function findAllForSelect(): array;

    public function deactivate(TransportUnitId $id): void;
}
