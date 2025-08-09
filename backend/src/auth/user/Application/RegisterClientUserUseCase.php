<?php

namespace Src\Auth\User\Application;

use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Domain\Contracts\RoleRepositoryInterface;
use Src\Shared\Domain\Contracts\IdGeneratorInterface;
use Src\Shared\Domain\Contracts\PasswordHasherInterface;
use Src\Auth\User\Domain\Entities\User;
use Src\Auth\User\Domain\ValueObjects\UserId;
use Src\Auth\User\Domain\ValueObjects\UserName;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use Src\Auth\User\Domain\ValueObjects\UserPassword;
use Src\Auth\User\Domain\ValueObjects\UserAddress;
use Src\Auth\User\Domain\ValueObjects\UserPhone;
use Src\Auth\User\Domain\ValueObjects\UserType;

final class RegisterClientUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepository,
        private RoleRepositoryInterface $roleRepository,
        private IdGeneratorInterface $idGenerator,
        private PasswordHasherInterface $hasher
    ) {}

    /**
     * Registers a new client (application layer orchestrator).
     *
     * @throws \InvalidArgumentException on validation errors from VOs
     */
    public function execute(
        string $name,
        string $email,
        ?string $address,
        ?string $phone,
        ?string $type,
        string $password
    ): void {
        // Generate id using injected generator (decoupled from DB)
        $rawId = $this->idGenerator->generate();
        $id = new UserId($rawId);

        // Create value objects (domain-level validation)
        $nameVo = new UserName($name);
        $emailVo = new UserEmail($email);
        $addressVo = new UserAddress($address);
        $phoneVo = new UserPhone($phone);
        $typeVo = new UserType($type);

        // Hash password via PasswordHasherInterface (infrastructure implementation injected)
        $hashed = $this->hasher->hash($password);
        $passwordVo = new UserPassword($hashed);

        // Build domain entity
        $user = new User(
            $id,
            $nameVo,
            $emailVo,
            $passwordVo,
            $addressVo,
            $phoneVo,
            $typeVo
        );

        // Persist via repository (infrastructure)
        $this->userRepository->save($user);

        // Assign role 'client' via RoleRepositoryInterface (infrastructure)
        $this->roleRepository->assignRoleToUser($user, 'client');
    }
}
