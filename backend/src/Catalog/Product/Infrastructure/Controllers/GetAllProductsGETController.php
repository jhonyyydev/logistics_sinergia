<?php

namespace Src\Catalog\Product\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Product\Application\GetAllProductsUseCase;
use Throwable;

final class GetAllProductsGETController extends Controller
{
    public function __construct(
        private GetAllProductsUseCase $useCase
    ) {}

    public function __invoke()
    {
        try {
            $products = $this->useCase->execute();
            return response()->json($products, 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
