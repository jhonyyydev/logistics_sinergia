<?php

namespace Src\Catalog\Client\Application;

use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;

final class GetAllClientsUseCase
{
    public function __construct(
        private ClientRepositoryInterface $repository
    ) {}

    public function execute(): array
    {
        return $this->repository->findAll();
    }
}
