<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\TransportUnit\Application\UpdateTransportUnitUseCase;
use Src\Catalog\TransportUnit\Infrastructure\Validators\UpdateTransportUnitRequest;
use Throwable;

final class UpdateTransportUnitPUTController extends Controller
{
    public function __construct(
        private UpdateTransportUnitUseCase $useCase
    ) {}

    public function __invoke(UpdateTransportUnitRequest $request, $id)
    {
        try {
            $this->useCase->execute(
                (int)$id,
                $request->identifier,
                $request->unit_type,
                $request->active
            );

            return response()->json(['message' => 'Transport Unit updated successfully'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
