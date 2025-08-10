<?php

namespace App\Http\Middleware;

use Closure;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;
use InvalidArgumentException;

class ValidateClientId
{
    public function handle($request, Closure $next)
    {
        try {
            new ClientId($request->route('id'));
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return $next($request);
    }
}
