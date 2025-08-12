<?php

namespace Src\Catalog\Destination\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Destination\Application\GetDestinationsForSelectUseCase;

final class GetDestinationsForSelectGETController extends Controller
{
    public function __construct(private GetDestinationsForSelectUseCase $useCase) {}

    public function __invoke()
    {
        return response()->json($this->useCase->execute(), 200);
    }
}
