<?php

namespace Src\Catalog\Destination\Application;

use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;

final class FindDestinationByIdUseCase
{
    public function __construct(
        private DestinationRepositoryInterface $repository
    ) {}

    public function execute(int $id): ?array
    {
        $destinationId = new DestinationId($id);
        $destination = $this->repository->findById($destinationId);

        if (!$destination) {
            return null;
        }

        return [
            'id'       => $destination->id()->value(),
            'name'     => $destination->name()->value(),
            'location' => $destination->location()->value(),
            'capacity' => $destination->capacity()->value(),
            'type'     => $destination->type()->value(),
        ];
    }
}
