<?php

namespace Src\Shared\Infrastructure;

use Src\Shared\Domain\Contracts\DestinationIdGeneratorInterface;
use App\Models\Destination as EloquentDestination;

final class SequentialDestinationIdGenerator implements DestinationIdGeneratorInterface
{
    public function generate(): int
    {
        $last = EloquentDestination::max('id') ?? 0;
        return (int) $last + 1;
    }
}
