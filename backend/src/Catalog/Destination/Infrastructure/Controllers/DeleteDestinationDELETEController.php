<?php

namespace Src\Catalog\Destination\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Destination\Application\DeleteDestinationUseCase;
use Throwable;

final class DeleteDestinationDELETEController extends Controller
{
    public function __construct(
        private DeleteDestinationUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        try {
            $this->useCase->execute((int)$id);

            return response()->json(['message' => 'Destination deleted successfully'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
