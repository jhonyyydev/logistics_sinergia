<?php

namespace Src\Catalog\Destination\Application;

use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;

final class GetDestinationsForSelectUseCase
{
    public function __construct(private DestinationRepositoryInterface $repository) {}

    public function execute(): array
    {
        return $this->repository->findAllForSelect();
    }
}
