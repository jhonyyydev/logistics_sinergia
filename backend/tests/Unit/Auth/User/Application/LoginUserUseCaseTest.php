<?php

namespace Tests\Unit\Auth\User\Application;

use DomainException;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Application\LoginUserUseCase;
use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Shared\Domain\Contracts\AuthServiceInterface;
use Src\Auth\User\Domain\Entities\User;
use Src\Auth\User\Domain\ValueObjects\UserId;
use Src\Auth\User\Domain\ValueObjects\UserName;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use Src\Auth\User\Domain\ValueObjects\UserPassword;
use Src\Auth\User\Domain\ValueObjects\UserAddress;
use Src\Auth\User\Domain\ValueObjects\UserPhone;
use Src\Auth\User\Domain\ValueObjects\UserType;
use Illuminate\Support\Facades\Hash;

class LoginUserUseCaseTest extends TestCase
{
    private $userRepository;
    private $authService;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userRepository = $this->createMock(UserRepositoryInterface::class);
        $this->authService = $this->createMock(AuthServiceInterface::class);

        // Necesario para usar Hash::check en pruebas unitarias
        Hash::shouldReceive('check')
            ->andReturnUsing(fn($plain, $hashed) => $hashed === 'hashed_password' && $plain === 'valid_password');
    }

    private function createUser(): User
    {
        return new User(
            new UserId(1),
            new UserName('John Doe'),
            new UserEmail('john@example.com'),
            new UserPassword('hashed_password'),
            new UserAddress('123 Street'),
            new UserPhone('123456789'),
            new UserType('national')
        );
    }

    #[Test]
    public function it_logs_in_successfully_with_correct_credentials(): void
    {
        $user = $this->createUser();

        $this->userRepository
            ->method('findByEmail')
            ->willReturn($user);

        $this->authService
            ->method('generateToken')
            ->with($user)
            ->willReturn('generated_token');

        $useCase = new LoginUserUseCase($this->userRepository, $this->authService);

        $token = $useCase->execute('john@example.com', 'valid_password');

        $this->assertSame('generated_token', $token);
    }

    #[Test]
    public function it_throws_exception_when_user_not_found(): void
    {
        $this->userRepository
            ->method('findByEmail')
            ->willReturn(null);

        $useCase = new LoginUserUseCase($this->userRepository, $this->authService);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('User not found.');

        $useCase->execute('unknown@example.com', 'valid_password');
    }

    #[Test]
    public function it_throws_exception_when_password_is_invalid(): void
    {
        $user = $this->createUser();

        $this->userRepository
            ->method('findByEmail')
            ->willReturn($user);

        $useCase = new LoginUserUseCase($this->userRepository, $this->authService);

        $this->expectException(DomainException::class);
        $this->expectExceptionMessage('Invalid credentials.');

        $useCase->execute('john@example.com', 'wrong_password');
    }
}
