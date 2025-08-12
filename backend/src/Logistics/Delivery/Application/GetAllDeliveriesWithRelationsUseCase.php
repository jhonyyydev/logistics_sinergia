<?php

namespace Src\Logistics\Delivery\Application;

use Src\Logistics\Delivery\Domain\Contracts\DeliveryRepositoryInterface;

final class GetAllDeliveriesWithRelationsUseCase
{
    public function __construct(private DeliveryRepositoryInterface $repository) {}

    public function execute(): array
    {
        return $this->repository->findAllWithRelations();
    }
}
