<?php

namespace Tests\Unit\Auth\User\Domain\ValueObjects;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\ValueObjects\UserPassword;

class UserPasswordTest extends TestCase
{
    #[Test]
    public function test_it_stores_a_valid_hashed_password(): void
    {
        $hash = password_hash('secret123', PASSWORD_BCRYPT);
        $password = new UserPassword($hash);

        $this->assertSame($hash, $password->value());
    }

    #[Test]
    public function test_it_throws_exception_when_hash_is_empty(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Password hash cannot be empty.');

        new UserPassword('');
    }

    #[Test]
    public function test_it_allows_hash_with_special_characters(): void
    {
        $hash = '$2y$10$usesomesillystringfore7hnbRJHxXVLeakoG8K30oukPsA.ztMG'; // ejemplo bcrypt válido
        $password = new UserPassword($hash);

        $this->assertSame($hash, $password->value());
        $this->assertMatchesRegularExpression('/^\$2y\$/', $password->value());
    }

    #[Test]
    public function test_multiple_instances_with_different_hashes_do_not_conflict(): void
    {
        $hash1 = password_hash('password1', PASSWORD_BCRYPT);
        $hash2 = password_hash('password2', PASSWORD_BCRYPT);

        $passObj1 = new UserPassword($hash1);
        $passObj2 = new UserPassword($hash2);

        $this->assertNotSame($passObj1->value(), $passObj2->value());
    }
}
