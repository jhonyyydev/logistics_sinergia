<?php

namespace Src\Catalog\Destination\Application;

use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;

final class DeleteDestinationUseCase
{
    public function __construct(
        private DestinationRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $destinationId = new DestinationId($id);

        $existingDestination = $this->repository->findById($destinationId);
        if (!$existingDestination) {
            throw new \InvalidArgumentException("Destination not found");
        }

        $this->repository->delete($destinationId);
    }
}
