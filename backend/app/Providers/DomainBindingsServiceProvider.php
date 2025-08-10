<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Infrastructure\Repositories\EloquentUserRepository;
use Src\Auth\User\Domain\Contracts\RoleRepositoryInterface;
use Src\Auth\Role\Infrastructure\Repositories\SpatieRoleRepository;
use Src\Shared\Domain\Contracts\IdGeneratorInterface;
use Src\Shared\Infrastructure\SequentialIdGenerator;
use Src\Shared\Domain\Contracts\PasswordHasherInterface;
use Src\Shared\Infrastructure\LaravelPasswordHasher;
use Src\Shared\Domain\Contracts\AuthServiceInterface;
use Src\Shared\Infrastructure\LaravelAuthService;

use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;
use Src\Catalog\Client\Infrastructure\Repositories\EloquentClientRepository;

class DomainBindingsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
        $this->app->bind(RoleRepositoryInterface::class, SpatieRoleRepository::class);
        $this->app->bind(IdGeneratorInterface::class, SequentialIdGenerator::class);
        $this->app->bind(PasswordHasherInterface::class, LaravelPasswordHasher::class);
        $this->app->bind(AuthServiceInterface::class, LaravelAuthService::class);

        $this->app->bind(ClientRepositoryInterface::class, EloquentClientRepository::class);
    }

    public function boot(): void
    {
        //
    }
}
