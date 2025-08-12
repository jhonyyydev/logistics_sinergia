<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\TransportUnit\Application\GetTransportUnitsForSelectUseCase;

final class GetTransportUnitsForSelectGETController extends Controller
{
    public function __construct(private GetTransportUnitsForSelectUseCase $useCase) {}

    public function __invoke()
    {
        return response()->json($this->useCase->execute(), 200);
    }
}
