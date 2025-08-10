<?php

namespace Src\Shared\Infrastructure;

use Src\Shared\Domain\Contracts\IdGeneratorInterface;
use App\Models\User as EloquentUser;

final class SequentialIdGenerator implements IdGeneratorInterface
{
    public function generate(): int
    {
        // For simple apps this is ok; for distributed systems use DB sequences or UUIDs.
        $last = (int) EloquentUser::max('id') ?? 0;
        return $last + 1;
    }
}
