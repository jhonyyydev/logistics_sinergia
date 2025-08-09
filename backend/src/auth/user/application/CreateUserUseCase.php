<?php

namespace Src\Auth\User\Application;

use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Domain\ValueObjects\UserName;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use Src\Auth\User\Domain\Entities\User;

class CreateUserUseCase {
    private UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository) {
        $this->userRepository = $userRepository;
    }

    public function execute(int $id, string $name, string $email){
        $nameValueObject = new UserName($name);
        $emailValueObject = new UserEmail($email);

        $user = new User($id, $nameValueObject, $emailValueObject);

        $this->userRepository->save($user);

    }
}
