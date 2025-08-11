<?php

namespace Src\Auth\User\Domain\Entities;

use Src\Auth\User\Domain\ValueObjects\UserId;
use Src\Auth\User\Domain\ValueObjects\UserName;
use Src\Auth\User\Domain\ValueObjects\UserEmail;
use Src\Auth\User\Domain\ValueObjects\UserPassword;
use Src\Auth\User\Domain\ValueObjects\UserAddress;
use Src\Auth\User\Domain\ValueObjects\UserPhone;
use Src\Auth\User\Domain\ValueObjects\UserType;

final class User
{
    public function __construct(
        private UserId $id,
        private UserName $name,
        private UserEmail $email,
        private UserPassword $password,
        private UserAddress $address,
        private UserPhone $phone,
        private UserType $type
    ) {}

    public function id(): UserId { return $this->id; }
    public function name(): UserName { return $this->name; }
    public function email(): UserEmail { return $this->email; }
    public function password(): UserPassword { return $this->password; }
    public function address(): UserAddress { return $this->address; }
    public function phone(): UserPhone { return $this->phone; }
    public function type(): UserType { return $this->type; }
}
