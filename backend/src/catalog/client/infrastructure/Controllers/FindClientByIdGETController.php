<?php

namespace Src\Catalog\Client\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Client\Application\FindClientByIdUseCase;

final class FindClientByIdGETController extends Controller
{
    public function __construct(
        private FindClientByIdUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        $client = $this->useCase->execute($id);

        if (!$client) {
            return response()->json(['message' => 'Client not found'], 404);
        }

        return response()->json($client, 200);
    }
}
