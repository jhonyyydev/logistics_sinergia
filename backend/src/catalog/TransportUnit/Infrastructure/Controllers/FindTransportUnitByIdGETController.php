<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\TransportUnit\Application\FindTransportUnitByIdUseCase;
use Throwable;

final class FindTransportUnitByIdGETController extends Controller
{
    public function __construct(
        private FindTransportUnitByIdUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        try {
            $unit = $this->useCase->execute((int)$id);

            if (!$unit) {
                return response()->json(['message' => 'Transport Unit not found'], 404);
            }

            return response()->json($unit, 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
