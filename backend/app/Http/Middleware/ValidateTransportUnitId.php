<?php

namespace App\Http\Middleware;

use Closure;
use InvalidArgumentException;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId as ValueObjectsTransportUnitId;

class ValidateTransportUnitId
{
    public function handle($request, Closure $next)
    {
        try {
            new ValueObjectsTransportUnitId($request->route('id'));
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return $next($request);
    }
}
