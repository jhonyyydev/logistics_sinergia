<?php

namespace Src\Auth\User\Infrastructure\Repositories;

use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Domain\Entities\User as DomainUser;
use Src\Auth\User\Domain\ValueObjects\UserId;
use App\Models\User as EloquentUser;

final class EloquentUserRepository implements UserRepositoryInterface
{
    public function save(DomainUser $user): void
    {
        $attributes = $this->mapToEloquentAttributes($user);

        EloquentUser::updateOrCreate(
            ['id' => $attributes['id']],
            $attributes
        );
    }

    public function findById(UserId $id): ?DomainUser
    {
        $user = EloquentUser::find($id->value());
        return $user ? $this->mapToDomain($user) : null;
    }

    public function findByEmail(string $email): ?DomainUser
    {
        $user = EloquentUser::where('email', $email)->first();
        return $user ? $this->mapToDomain($user) : null;
    }

    /**
     * Map Domain entity → Eloquent attributes
     */
    private function mapToEloquentAttributes(DomainUser $user): array
    {
        return [
            'id' => $user->id()->value(),
            'name' => $user->name()->value(),
            'email' => $user->email()->value(),
            'password' => $user->password()->value(),
            'address' => $user->address()->value(),
            'phone' => $user->phone()->value(),
            'type' => $user->type()->value(),
        ];
    }

    /**
     * Map Eloquent model → Domain entity
     */
    private function mapToDomain(EloquentUser $user): DomainUser
    {
        return new DomainUser(
            new \Src\Auth\User\Domain\ValueObjects\UserId($user->id),
            new \Src\Auth\User\Domain\ValueObjects\UserName($user->name),
            new \Src\Auth\User\Domain\ValueObjects\UserEmail($user->email),
            new \Src\Auth\User\Domain\ValueObjects\UserPassword($user->password),
            new \Src\Auth\User\Domain\ValueObjects\UserAddress($user->address),
            new \Src\Auth\User\Domain\ValueObjects\UserPhone($user->phone),
            new \Src\Auth\User\Domain\ValueObjects\UserType($user->type)
        );
    }

}
