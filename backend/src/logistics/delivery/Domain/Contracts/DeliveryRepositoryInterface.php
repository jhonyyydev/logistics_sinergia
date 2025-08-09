<?php

namespace Src\Logistics\Delivery\Domain\Contracts;

use Src\Logistics\Delivery\Domain\Entities\Delivery;

interface DeliveryRepositoryInterface
{
    public function create(Delivery $delivery): void;

    public function update(Delivery $delivery): void;

    public function findAll(): array;

    public function findOneById(int $id): ?Delivery;

    public function inactivate(int $id): void;
}
