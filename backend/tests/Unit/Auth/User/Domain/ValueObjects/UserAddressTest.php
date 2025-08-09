<?php

namespace Tests\Unit\Auth\User\Domain\ValueObjects;

use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\ValueObjects\UserAddress;

class UserAddressTest extends TestCase
{
    #[Test]
    public function test_it_stores_valid_address(): void
    {
        $addressString = '123 Main Street';
        $address = new UserAddress($addressString);

        $this->assertSame($addressString, $address->value());
    }

    #[Test]
    public function test_it_stores_null_when_no_address_provided(): void
    {
        $addressString = null;
        $address = new UserAddress($addressString);

        $this->assertNull($address->value());
    }

    #[Test]
    public function test_it_trims_whitespace_from_address(): void
    {
        $addressString = '   456 Elm Street   ';
        $address = new UserAddress($addressString);

        $this->assertSame('456 Elm Street', $address->value());
    }
}
