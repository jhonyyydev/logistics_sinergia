<?php

namespace Src\Shared\Infrastructure;

use Src\Shared\Domain\Contracts\DeliveryIdGeneratorInterface;
use App\Models\Delivery as EloquentDelivery;

final class SequentialDeliveryIdGenerator implements DeliveryIdGeneratorInterface
{
    public function generate(): int
    {
        $last = EloquentDelivery::max('id') ?? 0;
        return (int) $last + 1;
    }
}
