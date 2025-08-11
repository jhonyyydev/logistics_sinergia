<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\TransportUnit\Application\GetAllTransportUnitsUseCase;
use Throwable;

final class GetAllTransportUnitsGETController extends Controller
{
    public function __construct(
        private GetAllTransportUnitsUseCase $useCase
    ) {}

    public function __invoke()
    {
        try {
            $units = $this->useCase->execute();
            return response()->json($units, 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
