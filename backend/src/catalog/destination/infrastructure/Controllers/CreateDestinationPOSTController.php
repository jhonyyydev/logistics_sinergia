<?php

namespace Src\Catalog\Destination\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Destination\Application\CreateDestinationUseCase;
use Src\Catalog\Destination\Infrastructure\Validators\CreateDestinationRequest;

final class CreateDestinationPOSTController extends Controller
{
    public function __construct(
        private CreateDestinationUseCase $useCase
    ) {}

    public function __invoke(CreateDestinationRequest $request)
    {
        $this->useCase->execute(
            $request->name,
            $request->location,
            $request->capacity,
            $request->destination_type
        );

        return response()->json(['message' => 'Destination created successfully'], 201);
    }

}
