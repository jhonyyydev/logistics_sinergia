<?php

namespace Src\Logistics\Delivery\Infrastructure\Controllers;

use App\Http\Controllers\Controller;
use Src\Logistics\Delivery\Application\CreateDeliveryWithTransportUseCase;
use Src\Logistics\Delivery\Infrastructure\Validators\CreateDeliveryWithTransportRequest;

final class CreateDeliveryWithTransportPOSTController extends Controller
{
    public function __construct(
        private CreateDeliveryWithTransportUseCase $useCase
    ) {}

    public function __invoke(CreateDeliveryWithTransportRequest $request)
    {
        $this->useCase->execute(
            $request->user_id,
            $request->product_id,
            $request->product_type,
            $request->quantity,
            $request->log_date,
            $request->delivery_date,
            $request->shipping_price,
            $request->guide,
            $request->delivery_type,
            $request->transport_unit_id,
            $request->destination_id
        );

        return response()->json(['message' => 'Delivery created successfully'], 201);
    }
}

