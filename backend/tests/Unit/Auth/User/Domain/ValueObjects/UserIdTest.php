<?php

namespace Tests\Unit\Auth\User\Domain\ValueObjects;

use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;
use Src\Auth\User\Domain\ValueObjects\UserId;

class UserIdTest extends TestCase
{
    #[Test]
    #[DataProvider('validIdsProvider')]
    public function it_accepts_positive_integers(int $validId): void
    {
        $userId = new UserId($validId);

        $this->assertIsInt($userId->value());
        $this->assertSame($validId, $userId->value());
    }

    #[Test]
    #[DataProvider('invalidIdsProvider')]
    public function it_throws_exception_for_non_positive_integers(int $invalidId): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('UserId must be positive integer.');

        new UserId($invalidId);
    }

    public static function validIdsProvider(): array
    {
        return [
            'id is one' => [1],
            'id is ten' => [10],
            'id is large number' => [99999],
        ];
    }

    public static function invalidIdsProvider(): array
    {
        return [
            'id is zero' => [0],
            'id is negative' => [-5],
        ];
    }
}
