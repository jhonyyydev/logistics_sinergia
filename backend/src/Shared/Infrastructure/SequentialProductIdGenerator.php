<?php

namespace Src\Shared\Infrastructure;

use Src\Shared\Domain\Contracts\ProductIdGeneratorInterface;
use App\Models\Product as EloquentProduct;

final class SequentialProductIdGenerator implements ProductIdGeneratorInterface
{
    public function generate(): int
    {
        $last = EloquentProduct::max('id') ?? 0;
        return (int) $last + 1;
    }
}
