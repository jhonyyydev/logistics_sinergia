<?php

namespace Src\Catalog\Client\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Catalog\Client\Application\UpdateClientUseCase;
use Src\Catalog\Client\Infrastructure\Validators\UpdateClientRequest;
use Throwable;

final class UpdateClientPUTController extends Controller
{
    public function __construct(
        private UpdateClientUseCase $useCase
    ) {}

    public function __invoke(UpdateClientRequest $request, int $id)
    {
        try {
            $this->useCase->execute(
                $id,
                $request->input('name'),
                $request->input('email'),
                $request->input('address'),
                $request->input('phone'),
                $request->input('type'),
                $request->boolean('active')
            );

            return response()->json(['message' => 'Client updated successfully'], 200);

        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Unexpected error: ' . $e->getMessage()
            ], 500);
        }
    }
}
