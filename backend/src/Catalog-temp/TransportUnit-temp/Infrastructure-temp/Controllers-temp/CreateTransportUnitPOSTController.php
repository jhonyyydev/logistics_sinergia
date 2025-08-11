<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\TransportUnit\Application\CreateTransportUnitUseCase;
use Src\Catalog\TransportUnit\Infrastructure\Validators\CreateTransportUnitRequest;

final class CreateTransportUnitPOSTController extends Controller
{
    public function __construct(
        private CreateTransportUnitUseCase $useCase
    ) {}

    public function __invoke(CreateTransportUnitRequest $request)
    {
        $this->useCase->execute(
            $request->identifier,
            $request->unit_type,
            $request->active
        );

        return response()->json(['message' => 'Transport Unit created successfully'], 201);
    }
}
