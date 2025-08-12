<?php

namespace Src\Logistics\Delivery\Application;

use Src\Logistics\Delivery\Domain\Contracts\DeliveryRepositoryInterface;
use Src\Logistics\Delivery\Domain\Contracts\TransportDeliveryRepositoryInterface;
use Src\Logistics\Delivery\Domain\Entities\Delivery;
use Src\Logistics\Delivery\Domain\Entities\TransportDelivery;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryId;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryUserId;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryProductId;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryProductType;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryQuantity;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryLogDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryShippingPrice;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryGuide;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryType;
use Src\Logistics\Delivery\Domain\ValueObjects\TransportDeliveryId;
use Src\Logistics\Delivery\Domain\ValueObjects\TransportUnitId;
use Src\Logistics\Delivery\Domain\ValueObjects\DestinationId;
use Src\Shared\Domain\Contracts\DeliveryIdGeneratorInterface;

final class CreateDeliveryWithTransportUseCase
{
    public function __construct(
        private DeliveryRepositoryInterface $deliveryRepo,
        private TransportDeliveryRepositoryInterface $transportRepo,
        private DeliveryIdGeneratorInterface $idGenerator
    ) {}

    public function execute(
        int $userId,
        int $productId,
        string $productType,
        int $quantity,
        string $logDate,
        string $deliveryDate,
        float $shippingPrice,
        string $guide,
        string $deliveryType,
        int $transportUnitId,
        int $destinationId
    ): void {
        // Generar ID del delivery
        $rawId = $this->idGenerator->generate();
        $id = new DeliveryId($rawId);

        // Crear entidad Delivery con precios calculados
        $delivery = Delivery::createWithCalculatedPrice(
            $id,
            new DeliveryUserId($userId),
            new DeliveryProductId($productId),
            new DeliveryProductType($productType),
            new DeliveryQuantity($quantity),
            new DeliveryLogDate($logDate),
            new DeliveryDate(new \DateTimeImmutable($deliveryDate)),
            new DeliveryShippingPrice($shippingPrice),
            new DeliveryGuide($guide),
            new DeliveryType($deliveryType)
        );

        // Guardar y obtener el ID real en la DB
        $deliveryId = $this->deliveryRepo->createAndReturnId($delivery);

        // Crear entidad TransportDelivery asociada
        $transportDelivery = new TransportDelivery(
            new TransportDeliveryId($deliveryId),
            new TransportUnitId($transportUnitId),
            new DestinationId($destinationId)
        );

        $this->transportRepo->save($transportDelivery);
    }
}
