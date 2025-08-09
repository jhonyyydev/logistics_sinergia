<?php

namespace Tests\Unit\Auth\User\Domain\ValueObjects;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\ValueObjects\UserType;

class UserTypeTest extends TestCase
{
    #[Test]
    public function it_stores_valid_national_type(): void
    {
        $type = new UserType('national');

        $this->assertSame('national', $type->value());
    }

    #[Test]
    public function it_stores_valid_international_type(): void
    {
        $type = new UserType('international');

        $this->assertSame('international', $type->value());
    }

    #[Test]
    public function it_stores_null_when_no_type_provided(): void
    {
        $type = new UserType(null);

        $this->assertNull($type->value());
    }

    #[Test]
    public function it_is_case_insensitive(): void
    {
        $type = new UserType('NATIONAL');

        $this->assertSame('national', $type->value());
    }

    #[Test]
    public function it_throws_exception_for_invalid_type(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Invalid user type.');

        new UserType('invalid-type');
    }
}
