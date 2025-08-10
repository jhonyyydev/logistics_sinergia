<?php

namespace Tests\Unit\Auth\User\Domain\Entities;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\Entities\User;
use Src\Auth\User\Domain\ValueObjects\UserId;
use Src\Auth\User\Domain\ValueObjects\UserName;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use Src\Auth\User\Domain\ValueObjects\UserPassword;
use Src\Auth\User\Domain\ValueObjects\UserAddress;
use Src\Auth\User\Domain\ValueObjects\UserPhone;
use Src\Auth\User\Domain\ValueObjects\UserType;

class UserTest extends TestCase
{
    private function createUser(): User
    {
        return new User(
            new UserId(1),
            new UserName('John Doe'),
            new UserEmail('john@example.com'),
            new UserPassword('hashed_password_123'),
            new UserAddress('123 Main Street'),
            new UserPhone('+123456789'),
            new UserType('national')
        );
    }

    #[Test]
    public function it_stores_all_value_objects_correctly(): void
    {
        $user = $this->createUser();

        $this->assertSame(1, $user->id()->value());
        $this->assertSame('John Doe', $user->name()->value());
        $this->assertSame('john@example.com', $user->email()->value());
        $this->assertSame('hashed_password_123', $user->password()->value());
        $this->assertSame('123 Main Street', $user->address()->value());
        $this->assertSame('+123456789', $user->phone()->value());
        $this->assertSame('national', $user->type()->value());
    }

    #[Test]
    public function it_allows_nullable_address_and_phone(): void
    {
        $user = new User(
            new UserId(2),
            new UserName('Jane Smith'),
            new UserEmail('jane@example.com'),
            new UserPassword('hashed_pass'),
            new UserAddress(null),
            new UserPhone(null),
            new UserType(null)
        );

        $this->assertNull($user->address()->value());
        $this->assertNull($user->phone()->value());
        $this->assertNull($user->type()->value());
    }

    #[Test]
    public function it_accepts_different_user_types(): void
    {
        $national = new UserType('national');
        $international = new UserType('international');

        $this->assertSame('national', $national->value());
        $this->assertSame('international', $international->value());
    }
}
