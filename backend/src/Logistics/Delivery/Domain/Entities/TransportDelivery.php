<?php

namespace Src\Logistics\Delivery\Domain\Entities;

use Src\Logistics\Delivery\Domain\ValueObjects\TransportDeliveryId;
use Src\Logistics\Delivery\Domain\ValueObjects\TransportUnitId;
use Src\Logistics\Delivery\Domain\ValueObjects\DestinationId;

final class TransportDelivery
{
    public function __construct(
        private TransportDeliveryId $deliveryId,
        private TransportUnitId $transportUnitId,
        private DestinationId $destinationId
    ) {}

    public function deliveryId(): TransportDeliveryId
    {
        return $this->deliveryId;
    }

    public function transportUnitId(): TransportUnitId
    {
        return $this->transportUnitId;
    }

    public function destinationId(): DestinationId
    {
        return $this->destinationId;
    }
}
