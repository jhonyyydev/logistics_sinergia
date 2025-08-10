<?php

namespace Src\Catalog\Client\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Client\Application\DeactivateClientUseCase;
use Throwable;

final class DeactivateClientDELETEController extends Controller
{
    public function __construct(
        private DeactivateClientUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        try {
            $this->useCase->execute((int)$id);

            return response()->json(['message' => 'Client status successfully changed'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}

