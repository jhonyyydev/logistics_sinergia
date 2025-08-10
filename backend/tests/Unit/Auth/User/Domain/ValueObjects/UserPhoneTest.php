<?php

namespace Tests\Unit\Auth\User\Domain\ValueObjects;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\ValueObjects\UserPhone;

class UserPhoneTest extends TestCase
{
    #[Test]
    public function test_it_stores_valid_phone(): void
    {
        $phoneString = '1234567890';
        $phone = new UserPhone($phoneString);

        $this->assertSame($phoneString, $phone->value());
    }
    #[Test]
    public function test_it_stores_null_when_no_phone_provided(): void
    {
        $phoneString = null;
        $phone = new UserPhone($phoneString);

        $this->assertNull($phone->value());
    }
    #[Test]
    public function test_it_trims_whitespace_from_phone(): void
    {
        $phoneString = '   987654321   ';
        $phone = new UserPhone($phoneString);

        $this->assertSame('987654321', $phone->value());
    }
    #[Test]
    public function test_it_throws_exception_when_phone_exceeds_max_length(): void
    {
        $longPhone = str_repeat('1', 21); // 21 caracteres

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Phone max length is 20 characters.');

        new UserPhone($longPhone);
    }
}
