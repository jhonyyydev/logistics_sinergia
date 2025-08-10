<?php

namespace Src\Catalog\Destination\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Destination\Application\FindDestinationByIdUseCase;
use Throwable;

final class FindDestinationByIdGETController extends Controller
{
    public function __construct(
        private FindDestinationByIdUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        try {
            $destination = $this->useCase->execute((int)$id);

            if (!$destination) {
                return response()->json(['message' => 'Destination not found'], 404);
            }

            return response()->json($destination, 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
