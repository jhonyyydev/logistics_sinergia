<?php

namespace Src\Catalog\Destination\Domain\Contracts;

use Src\Catalog\Destination\Domain\Entities\Destination;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;

interface DestinationRepositoryInterface
{
    public function insert(Destination $destination): void;
    public function update(Destination $destination): void;
    public function findById(DestinationId $id): ?Destination;
    public function findAll(): array;
    public function delete(DestinationId $id): void;
}
