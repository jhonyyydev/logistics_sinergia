<?php

namespace Src\Catalog\Client\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Client\Application\DeactivateClientUseCase;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;

final class DeactivateClientDELETEController extends Controller
{
    public function __construct(
        private DeactivateClientUseCase $useCase
    ) {}

    public function __invoke($id)
    {
        $clientId = new ClientId($id);

        $this->useCase->execute($clientId);

        return response()->json(['message' => 'Client deactivated successfully'], 200);
    }
}

