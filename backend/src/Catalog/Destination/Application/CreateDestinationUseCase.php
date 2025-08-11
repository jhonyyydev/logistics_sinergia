<?php

namespace Src\Catalog\Destination\Application;

use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;
use Src\Catalog\Destination\Domain\Entities\Destination;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationName;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationLocation;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationCapacity;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationType;
use Src\Shared\Domain\Contracts\DestinationIdGeneratorInterface;

final class CreateDestinationUseCase
{
    public function __construct(
        private DestinationRepositoryInterface $repository,
        private DestinationIdGeneratorInterface $idGenerator
    ) {}

    public function execute(
        string $name,
        string $location,
        ?int $capacity,
        string $destinationType
    ): void {
        // Generate id using injected generator (decoupled from DB)
        $rawId = $this->idGenerator->generate();
        $id = new DestinationId($rawId);

        $destination = new Destination(
            $id,
            new DestinationName($name),
            new DestinationLocation($location),
            new DestinationCapacity($capacity),
            new DestinationType($destinationType)
        );

        $this->repository->insert($destination);
    }
}
