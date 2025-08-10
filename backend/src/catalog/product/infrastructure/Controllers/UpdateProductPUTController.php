<?php

namespace Src\Catalog\Product\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Product\Application\UpdateProductUseCase;
use Src\Catalog\Product\Infrastructure\Validators\UpdateProductRequest;
use Throwable;

final class UpdateProductPUTController extends Controller
{
    public function __construct(
        private UpdateProductUseCase $useCase
    ) {}

    public function __invoke(UpdateProductRequest $request, $id)
    {
        try {
            $this->useCase->execute(
                (int)$id,
                $request->name,
                $request->description,
                $request->type,
                $request->date_creation
            );

            return response()->json(['message' => 'Product updated successfully'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
