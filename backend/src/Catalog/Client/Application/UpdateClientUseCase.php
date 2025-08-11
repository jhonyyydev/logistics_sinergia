<?php

namespace Src\Catalog\Client\Application;

use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;
use Src\Catalog\Client\Domain\Entities\Client;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;
use Src\Catalog\Client\Domain\ValueObjects\ClientName;
use Src\Catalog\Client\Domain\ValueObjects\ClientEmail;
use Src\Catalog\Client\Domain\ValueObjects\ClientAddress;
use Src\Catalog\Client\Domain\ValueObjects\ClientPhone;
use Src\Catalog\Client\Domain\ValueObjects\ClientType;

final class UpdateClientUseCase
{
    public function __construct(
        private ClientRepositoryInterface $repository
    ) {}

    public function execute(
        int $id,
        string $name,
        string $email,
        ?string $address,
        ?string $phone,
        ?string $type,
        bool $active
    ): void {
        $client = new Client(
            new ClientId($id),
            new ClientName($name),
            new ClientEmail($email),
            new ClientAddress($address ?? ''),
            new ClientPhone($phone ?? ''),
            new ClientType($type ?? 'nacional'),
            $active
        );

        $this->repository->update($client);
    }
}
