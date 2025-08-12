<?php

namespace Src\Logistics\Delivery\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Logistics\Delivery\Application\GetAllDeliveriesWithRelationsUseCase;

final class GetAllDeliveriesWithRelationsGETController extends Controller
{
    public function __construct(private GetAllDeliveriesWithRelationsUseCase $useCase) {}

    public function __invoke()
    {
        $data = $this->useCase->execute();
        return response()->json($data, 200);
    }
}
