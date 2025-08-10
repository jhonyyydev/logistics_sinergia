<?php

namespace Src\Catalog\Product\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Product\Application\CreateProductUseCase;
use Src\Catalog\Product\Infrastructure\Validators\CreateProductRequest;

final class CreateProductPOSTController extends Controller
{
    public function __construct(
        private CreateProductUseCase $useCase
    ) {}

    public function __invoke(CreateProductRequest $request)
    {
        $this->useCase->execute(
            $request->name,
            $request->description,
            $request->type,
            $request->date_creation
        );

        return response()->json(['message' => 'Product created successfully'], 201);
    }
}
