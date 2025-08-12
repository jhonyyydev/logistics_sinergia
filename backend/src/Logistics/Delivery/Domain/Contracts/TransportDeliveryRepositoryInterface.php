<?php

namespace Src\Logistics\Delivery\Domain\Contracts;

use Src\Logistics\Delivery\Domain\Entities\TransportDelivery;
use Src\Logistics\Delivery\Domain\ValueObjects\TransportDeliveryId;

interface TransportDeliveryRepositoryInterface
{
    public function save(TransportDelivery $transportDelivery): void;
    public function findByDeliveryId(TransportDeliveryId $id): ?TransportDelivery;
}
