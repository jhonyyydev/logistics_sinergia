<?php

namespace Src\Catalog\Product\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Product\Application\DeleteProductUseCase;
use Throwable;

final class DeleteProductDELETEController extends Controller
{
    public function __construct(
        private DeleteProductUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        try {
            $this->useCase->execute((int)$id);

            return response()->json(['message' => 'Product deleted successfully'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}

