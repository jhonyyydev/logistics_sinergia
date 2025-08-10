<?php

namespace Src\Shared\Infrastructure;

use Src\Shared\Domain\Contracts\TransportUnitIdGeneratorInterface;
use App\Models\TransportUnit as EloquentTransportUnit;

final class SequentialTransportUnitIdGenerator implements TransportUnitIdGeneratorInterface
{
    public function generate(): int
    {
        $last = EloquentTransportUnit::max('id') ?? 0;
        return (int) $last + 1;
    }
}
