<?php

namespace App\Http\Middleware;

use Closure;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;
use InvalidArgumentException;

class ValidateDestinationId
{
    public function handle($request, Closure $next)
    {
        try {
            new DestinationId($request->route('id'));
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return $next($request);
    }
}
