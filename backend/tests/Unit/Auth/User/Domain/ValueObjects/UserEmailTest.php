<?php

namespace Tests\Unit\Auth\User\Domain\ValueObjects;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\ValueObjects\UserEmail;

class UserEmailTest extends TestCase
{
    #[Test]
    public function it_stores_a_valid_email()
    {
        $email = new UserEmail('john.doe@example.com');
        $this->assertEquals('john.doe@example.com', $email->value());
    }

    #[Test]
    public function it_throws_exception_for_invalid_email()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid email format.');

        new UserEmail('invalid-email');
    }

    #[Test]
    public function it_fails_when_email_has_spaces()
    {
        $this->expectException(\InvalidArgumentException::class);
        new UserEmail(' john@example.com ');
    }
}
