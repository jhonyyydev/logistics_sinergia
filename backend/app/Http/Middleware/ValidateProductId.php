<?php

namespace App\Http\Middleware;

use Closure;
use InvalidArgumentException;
use Src\Catalog\Product\Domain\ValueObjects\ProductId as ValueObjectsProductId;

class ValidateProductId
{
    public function handle($request, Closure $next)
    {
        try {
            new ValueObjectsProductId($request->route('id'));
        } catch (InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        }

        return $next($request);
    }
}
