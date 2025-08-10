<?php

namespace Src\Catalog\Destination\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Destination\Application\UpdateDestinationUseCase;
use Src\Catalog\Destination\Infrastructure\Validators\UpdateDestinationRequest;
use Throwable;

final class UpdateDestinationPUTController extends Controller
{
    public function __construct(
        private UpdateDestinationUseCase $useCase
    ) {}

    public function __invoke(UpdateDestinationRequest $request, $id)
    {
        try {
            $this->useCase->execute(
                (int)$id,
                $request->name,
                $request->location,
                $request->capacity,
                $request->destination_type
            );

            return response()->json(['message' => 'Destination updated successfully'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
