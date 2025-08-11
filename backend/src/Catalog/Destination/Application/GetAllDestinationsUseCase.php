<?php

namespace Src\Catalog\Destination\Application;

use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;

final class GetAllDestinationsUseCase
{
    public function __construct(
        private DestinationRepositoryInterface $repository
    ) {}

    public function execute(): array
    {
        $destinations = $this->repository->findAll();

        return array_map(function ($destination) {
            return [
                'id'       => $destination->id()->value(),
                'name'     => $destination->name()->value(),
                'location' => $destination->location()->value(),
                'capacity' => $destination->capacity()->value(),
                'type'     => $destination->type()->value(),
            ];
        }, $destinations);
    }
}
