<?php

namespace Src\Catalog\Client\Infrastructure\Repositories;

use App\Models\User as EloquentUser;
use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;
use Src\Catalog\Client\Domain\Entities\Client as DomainClient;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;
use Src\Catalog\Client\Domain\ValueObjects\ClientName;
use Src\Catalog\Client\Domain\ValueObjects\ClientEmail;
use Src\Catalog\Client\Domain\ValueObjects\ClientAddress;
use Src\Catalog\Client\Domain\ValueObjects\ClientPhone;
use Src\Catalog\Client\Domain\ValueObjects\ClientType;

final class EloquentClientRepository implements ClientRepositoryInterface
{
    public function findById(ClientId $id): ?DomainClient
    {
        $user = EloquentUser::role('client') // filter "client" rol
            ->find($id->value());

        return $user ? $this->mapToDomain($user) : null;
    }

    public function findAll(): array
    {
        // filter users with "client" rol
        $users = EloquentUser::role('client')
            ->select('id', 'name', 'email', 'address', 'phone', 'type', 'active')
            ->get();

        return $users->map(fn($user) => $this->mapToDomain($user))->toArray();
    }

    public function update(DomainClient $client): void
    {
        EloquentUser::where('id', $client->id()->value())->update([
            'name'    => $client->fullName()->value(),
            'email'   => $client->email()->value(),
            'address' => $client->address()->value(),
            'phone'   => $client->phone()->value(),
            'type'    => $client->type()->value(),
            'active'  => $client->isActive(),
        ]);
    }

    public function deactivate(ClientId $id): void
    {
        EloquentUser::where('id', $id->value())->update(['active' => false]);
    }

    /**
     * Map Eloquent → Domain
     */
    private function mapToDomain(EloquentUser $user): DomainClient
    {
        return new DomainClient(
            new ClientId($user->id),
            new ClientName($user->name),
            new ClientEmail($user->email),
            new ClientAddress($user->address ?? ''),
            new ClientPhone($user->phone ?? ''),
            new ClientType($user->type ?? 'nacional'),
            (bool) $user->active
        );
    }
}
