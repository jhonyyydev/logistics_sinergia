<?php

namespace Src\Logistics\Delivery\Infrastructure\Repositories;

use Src\Logistics\Delivery\Domain\Contracts\TransportDeliveryRepositoryInterface;
use Src\Logistics\Delivery\Domain\Entities\TransportDelivery;
use Src\Logistics\Delivery\Domain\ValueObjects\TransportDeliveryId;
use App\Models\TransportDelivery as EloquentTransportDelivery;

final class EloquentTransportDeliveryRepository implements TransportDeliveryRepositoryInterface
{
    public function save(TransportDelivery $transportDelivery): void
    {
        EloquentTransportDelivery::create([
            'delivery_id'       => $transportDelivery->deliveryId()->value(),
            'transport_unit_id' => $transportDelivery->transportUnitId()->value(),
            'destination_id'    => $transportDelivery->destinationId()->value(),
        ]);
    }

    public function findByDeliveryId(TransportDeliveryId $id): ?TransportDelivery
    {
        $model = EloquentTransportDelivery::where('delivery_id', $id->value())->first();
        if (!$model) return null;

        return null;
    }
}
