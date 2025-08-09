<?php

namespace Src\Auth\User\Application;

Use Src\Auth\User\Domain\Contracts\UserRepositoryInterface;
use Src\Auth\User\Domain\Entities\User;

class GetUserByIdUseCase {
    private UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository) {
        $this->userRepository = $userRepository;
    }

    public function __invoke(int $id):? User {
        return $this->userRepository->findById($id);
    }
}