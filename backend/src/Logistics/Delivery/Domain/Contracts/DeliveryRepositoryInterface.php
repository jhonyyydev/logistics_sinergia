<?php

namespace Src\Logistics\Delivery\Domain\Contracts;

use Src\Logistics\Delivery\Domain\Entities\Delivery;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryId;

interface DeliveryRepositoryInterface
{
    public function createAndReturnId(Delivery $delivery): int;

    /**
     * @return Delivery[]
     */
    public function findAllWithRelations(): array;

    public function update(Delivery $delivery): void;

    public function findById(DeliveryId $id): ?Delivery;
}
