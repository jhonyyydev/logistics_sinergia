<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\TransportUnit\Application\DeactivateTransportUnitUseCase;
use Throwable;

final class DeactivateTransportUnitDELETEController extends Controller
{
    public function __construct(
        private DeactivateTransportUnitUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        try {
            $this->useCase->execute((int)$id);

            return response()->json(['message' => 'Transport unit status successfully changed'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
