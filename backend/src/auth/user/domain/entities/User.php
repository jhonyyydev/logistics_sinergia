<?php

namespace Src\Auth\User\Domain\Entities;

Use Src\Auth\User\Domain\ValueObjects\UserName;
Use Src\Auth\User\Domain\ValueObjects\UserEmail;

class User {
    private int $id;
    private UserName $name;
    private UserEmail $email;

    public function __construct(int $id, UserName $name, UserEmail $email) {
        $this->name = $name;
        $this->email = $email;
    }

    public function name (): UserName {
        return $this->name;
    }

    public function email (): UserEmail {
        return $this->email;
    }

    public function id(): int {
        return $this->id;
    }

}