<?php

namespace Src\Catalog\Client\Application;

use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;

final class DeactivateClientUseCase
{
    public function __construct(
        private ClientRepositoryInterface $repository
    ) {}

    public function execute(int $id): void
    {
        $clientId = new ClientId($id);

        $client = $this->repository->findById($clientId);

        if (!$client) {
            throw new \InvalidArgumentException("Client not found");
        }

        $client->toggleActive();

        $this->repository->update($client);
    }
}
