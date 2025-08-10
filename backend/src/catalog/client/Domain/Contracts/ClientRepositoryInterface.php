<?php

namespace Src\Catalog\Client\Domain\Contracts;

use Src\Catalog\Client\Domain\Entities\Client;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;

interface ClientRepositoryInterface
{
    public function findById(ClientId $id): ?Client;
    public function findAll(): array;
    public function update(Client $client): void;
    public function deactivate(ClientId $id): void;
}
