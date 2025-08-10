<?php

namespace Src\Catalog\Product\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Product\Application\FindProductByIdUseCase;
use Throwable;

final class FindProductByIdGETController extends Controller
{
    public function __construct(
        private FindProductByIdUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        try {
            $product = $this->useCase->execute((int)$id);

            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            return response()->json($product, 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
