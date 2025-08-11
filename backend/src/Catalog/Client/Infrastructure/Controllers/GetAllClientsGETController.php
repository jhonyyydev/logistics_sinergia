<?php

namespace Src\Catalog\Client\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Client\Application\GetAllClientsUseCase;
use Throwable;

final class GetAllClientsGETController extends Controller
{
    public function __construct(
        private GetAllClientsUseCase $useCase
    ) {}

    public function __invoke()
    {
        try {
            $clients = $this->useCase->execute();

            $clientsArray = array_map(fn($client) => [
                'id'        => $client->id()->value(),
                'full_name' => $client->fullName()->value(),
                'email'     => $client->email()->value(),
                'address'   => $client->address()->value(),
                'phone'     => $client->phone()->value(),
                'type'      => $client->type()->value(),
                'active'    => $client->isActive(),
            ], $clients);

            return response()->json($clientsArray, 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
