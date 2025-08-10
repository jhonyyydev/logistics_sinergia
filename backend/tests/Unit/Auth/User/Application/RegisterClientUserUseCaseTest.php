<?php

namespace Tests\Unit\Auth\User\Application;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Application\RegisterClientUserUseCase;
use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Domain\Contracts\RoleRepositoryInterface;
use Src\Shared\Domain\Contracts\IdGeneratorInterface;
use Src\Shared\Domain\Contracts\PasswordHasherInterface;

class RegisterClientUserUseCaseTest extends TestCase
{
    private $userRepository;
    private $roleRepository;
    private $idGenerator;
    private $hasher;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userRepository = $this->createMock(UserRepositoryInterface::class);
        $this->roleRepository = $this->createMock(RoleRepositoryInterface::class);
        $this->idGenerator    = $this->createMock(IdGeneratorInterface::class);
        $this->hasher         = $this->createMock(PasswordHasherInterface::class);
    }

    #[Test]
    public function it_throws_exception_for_invalid_email(): void
    {
        $this->idGenerator
            ->method('generate')
            ->willReturn(1); // fuerza ID válido

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid email format.');

        $useCase = new RegisterClientUserUseCase(
            $this->userRepository,
            $this->roleRepository,
            $this->idGenerator,
            $this->hasher
        );

        $useCase->execute(
            'John Doe',
            'invalid-email',
            '123 Street',
            '123456789',
            'national',
            'plain_password'
        );
    }

    #[Test]
    public function it_throws_exception_for_invalid_user_type(): void
    {
        $this->idGenerator
            ->method('generate')
            ->willReturn(1); // fuerza ID válido

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid user type.');

        $useCase = new RegisterClientUserUseCase(
            $this->userRepository,
            $this->roleRepository,
            $this->idGenerator,
            $this->hasher
        );

        $useCase->execute(
            'John Doe',
            'john@example.com',
            '123 Street',
            '123456789',
            'invalid_type',
            'plain_password'
        );
    }

}
