<?php

namespace Src\Catalog\Client\Application;

use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;

final class FindClientByIdUseCase
{
    public function __construct(
        private ClientRepositoryInterface $repository
    ) {}

    public function execute(mixed $id): ?array
    {
        $clientId = new ClientId($id);

        $client = $this->repository->findById($clientId);

        if (!$client) {
            return null;
        }

        return [
            'id'      => $client->id()->value(),
            'name'    => $client->fullName()->value(),
            'email'   => $client->email()->value(),
            'address' => $client->address()->value(),
            'phone'   => $client->phone()->value(),
            'type'    => $client->type()->value(),
            'active'  => $client->isActive(),
        ];
    }
}
