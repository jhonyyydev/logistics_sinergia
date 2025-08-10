<?php

namespace Src\Catalog\Destination\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Destination\Application\GetAllDestinationsUseCase;
use Throwable;

final class GetAllDestinationsGETController extends Controller
{
    public function __construct(
        private GetAllDestinationsUseCase $useCase
    ) {}

    public function __invoke()
    {
        try {
            $destinations = $this->useCase->execute();
            return response()->json($destinations, 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
