<?php

namespace Src\Catalog\Product\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Product\Application\GetProductsForSelectUseCase;

final class GetProductsForSelectGETController extends Controller
{
    public function __construct(private GetProductsForSelectUseCase $useCase) {}

    public function __invoke()
    {
        return response()->json($this->useCase->execute(), 200);
    }
}
