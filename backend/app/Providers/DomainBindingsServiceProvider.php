<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Infrastructure\Repositories\EloquentUserRepository;
use Src\Auth\User\Domain\Contracts\RoleRepositoryInterface;
use Src\Auth\Role\Infrastructure\Repositories\SpatieRoleRepository;
use Src\Shared\Domain\Contracts\IdGeneratorInterface;
use Src\Shared\Infrastructure\SequentialIdGenerator;
use Src\Shared\Domain\Contracts\DestinationIdGeneratorInterface;
use Src\Shared\Infrastructure\SequentialDestinationIdGenerator;
use Src\Shared\Infrastructure\SequentialProductIdGenerator;
use Src\Shared\Infrastructure\SequentialTransportUnitIdGenerator;

use Src\Shared\Domain\Contracts\PasswordHasherInterface;
use Src\Shared\Infrastructure\LaravelPasswordHasher;
use Src\Shared\Domain\Contracts\AuthServiceInterface;
use Src\Shared\Infrastructure\LaravelAuthService;

use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;
use Src\Catalog\Client\Infrastructure\Repositories\EloquentClientRepository;

use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;
use Src\Catalog\Destination\Infrastructure\Repositories\EloquentDestinationRepository;

use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;
use Src\Catalog\Product\Infrastructure\Repositories\EloquentProductRepository;
use Src\Shared\Domain\Contracts\ProductIdGeneratorInterface;

use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;
use Src\Catalog\TransportUnit\Infrastructure\Repositories\EloquentTransportUnitRepository;
use Src\Shared\Domain\Contracts\TransportUnitIdGeneratorInterface;

class DomainBindingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, SpatieRoleRepository::class);
        $this->app->bind(IdGeneratorInterface::class, SequentialIdGenerator::class);
        $this->app->bind(DestinationIdGeneratorInterface::class, SequentialDestinationIdGenerator::class);
        $this->app->bind(ProductIdGeneratorInterface::class, SequentialProductIdGenerator::class);
        $this->app->bind(TransportUnitIdGeneratorInterface::class, SequentialTransportUnitIdGenerator::class);
        $this->app->bind(PasswordHasherInterface::class, LaravelPasswordHasher::class);
        $this->app->bind(AuthServiceInterface::class, LaravelAuthService::class);

        // Client bindings
        $this->app->bind(
            ClientRepositoryInterface::class,
            EloquentClientRepository::class
        );

        // Destination bindings
        $this->app->bind(
            DestinationRepositoryInterface::class,
            EloquentDestinationRepository::class
        );

        // Product bindings
        $this->app->bind(
            ProductRepositoryInterface::class,
            EloquentProductRepository::class
        );

        // Transpor Unit bindings
        $this->app->bind(
            TransportUnitRepositoryInterface::class,
            EloquentTransportUnitRepository::class
        );
    }

    public function boot(): void
    {
        //
    }
}
