<?php

namespace Tests\Feature\Auth\User\Infrastructure\Repositories;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Src\Auth\User\Infrastructure\Repositories\EloquentUserRepository;
use Src\Auth\User\Domain\Entities\User as DomainUser;
use Src\Auth\User\Domain\ValueObjects\UserId;
use Src\Auth\User\Domain\ValueObjects\UserName;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use Src\Auth\User\Domain\ValueObjects\UserPassword;
use Src\Auth\User\Domain\ValueObjects\UserAddress;
use Src\Auth\User\Domain\ValueObjects\UserPhone;
use Src\Auth\User\Domain\ValueObjects\UserType;
use App\Models\User as EloquentUser;

class EloquentUserRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private EloquentUserRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new EloquentUserRepository();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_saves_and_finds_user_by_id(): void
    {
        $domainUser = $this->makeDomainUser(1, 'John Doe', 'john@example.com');

        $this->repository->save($domainUser);

        $found = $this->repository->findById(new UserId(1));

        $this->assertNotNull($found);
        $this->assertSame('John Doe', $found->name()->value());
        $this->assertSame('john@example.com', $found->email()->value());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_saves_and_finds_user_by_email(): void
    {
        $domainUser = $this->makeDomainUser(2, 'Jane Doe', 'jane@example.com');

        $this->repository->save($domainUser);

        $found = $this->repository->findByEmail('jane@example.com');

        $this->assertNotNull($found);
        $this->assertSame('Jane Doe', $found->name()->value());
        $this->assertSame('jane@example.com', $found->email()->value());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_null_when_user_not_found_by_id(): void
    {
        $result = $this->repository->findById(new UserId(999));
        $this->assertNull($result);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_null_when_user_not_found_by_email(): void
    {
        $result = $this->repository->findByEmail('nonexistent@example.com');
        $this->assertNull($result);
    }

    private function makeDomainUser(int $id, string $name, string $email): DomainUser
    {
        return new DomainUser(
            new UserId($id),
            new UserName($name),
            new UserEmail($email),
            new UserPassword('hashed-password'),
            new UserAddress('123 Main St'),
            new UserPhone('123456789'),
            new UserType('national')
        );
    }
}
