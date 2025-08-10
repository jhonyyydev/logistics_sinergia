<?php

namespace Src\Catalog\Destination\Application;

use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;
use Src\Catalog\Destination\Domain\Entities\Destination;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationName;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationLocation;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationCapacity;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationType;

final class UpdateDestinationUseCase
{
    public function __construct(
        private DestinationRepositoryInterface $repository
    ) {}

    public function execute(
        int $id,
        ?string $name,
        ?string $location,
        ?int $capacity,
        ?string $destinationType
    ): void {
        $destinationId = new DestinationId($id);

        $existingDestination = $this->repository->findById($destinationId);
        if (!$existingDestination) {
            throw new \InvalidArgumentException("Destination not found");
        }

        $updatedDestination = new Destination(
            $destinationId,
            new DestinationName($name ?? $existingDestination->name()->value()),
            new DestinationLocation($location ?? $existingDestination->location()->value()),
            new DestinationCapacity($capacity ?? $existingDestination->capacity()->value()),
            new DestinationType($destinationType ?? $existingDestination->type()->value())
        );

        $this->repository->update($updatedDestination);
    }
}
