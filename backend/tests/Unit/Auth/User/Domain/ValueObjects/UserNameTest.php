<?php

namespace Tests\Unit\Auth\User\Domain\ValueObjects;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\ValueObjects\UserName;

class UserNameTest extends TestCase
{
    #[Test]
    public function test_it_stores_a_valid_name(): void
    {
        $name = new UserName('John');
        $this->assertSame('John', $name->value());
    }

    #[Test]
    public function test_it_allows_exactly_three_characters(): void
    {
        $name = new UserName('Ana');
        $this->assertSame('Ana', $name->value());
    }

    #[Test]
    public function test_it_throws_exception_for_too_short_name(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('User name must be at least 3 characters.');

        new UserName('Jo');
    }

    #[Test]
    public function test_it_accepts_long_names(): void
    {
        $longName = str_repeat('a', 50);
        $name = new UserName($longName);
        $this->assertSame($longName, $name->value());
    }
}
