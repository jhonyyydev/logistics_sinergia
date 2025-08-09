<?php

namespace Src\Logistics\Delivery\Domain\Entities;

use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryProductType;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryQuantity;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryLogDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryShippingPrice;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryFinalPrice;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryGuide;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryStatus;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryType;

final class Delivery
{
    public function __construct(
        private int $id,
        private int $clientId,
        private int $productId,
        private DeliveryProductType $productType,
        private DeliveryQuantity $quantity,
        private DeliveryType $deliveryType,
        private DeliveryLogDate $logDate,
        private DeliveryDate $deliveryDate,
        private DeliveryShippingPrice $shippingPrice,
        private DeliveryFinalPrice $finalPrice,
        private DeliveryGuide $guide,
        private DeliveryStatus $status
    ) {}

    public static function createWithCalculatedPrice(
        int $id,
        int $clientId,
        int $productId,
        DeliveryProductType $productType,
        DeliveryQuantity $quantity,
        DeliveryType $deliveryType,
        DeliveryLogDate $logDate,
        DeliveryDate $deliveryDate,
        DeliveryShippingPrice $shippingPrice,
        DeliveryGuide $guide
    ): self {
        $finalPrice = DeliveryFinalPrice::fromPricingRules(
            $deliveryType,
            $shippingPrice->value(),
            $quantity->value()
        );

        return new self(
            $id,
            $clientId,
            $productId,
            $productType,
            $quantity,
            $deliveryType,
            $logDate,
            $deliveryDate,
            $shippingPrice,
            $finalPrice,
            $guide,
            new DeliveryStatus('pending')
        );
    }

    // Update Methods

    public function updateQuantity(DeliveryQuantity $quantity): void
    {
        $this->quantity = $quantity;
        $this->recalculateFinalPrice();
    }

    public function changeDeliveryType(DeliveryType $type): void
    {
        $this->deliveryType = $type;
        $this->recalculateFinalPrice();
    }

    private function recalculateFinalPrice(): void
    {
        $this->finalPrice = DeliveryFinalPrice::fromPricingRules(
            $this->deliveryType,
            $this->shippingPrice->value(),
            $this->quantity->value()
        );
    }

    // Getters

    public function id(): int
    {
        return $this->id;
    }

    public function clientId(): int
    {
        return $this->clientId;
    }

    public function productId(): int
    {
        return $this->productId;
    }

    public function productType(): DeliveryProductType
    {
        return $this->productType;
    }

    public function quantity(): DeliveryQuantity
    {
        return $this->quantity;
    }

    public function deliveryType(): DeliveryType
    {
        return $this->deliveryType;
    }

    public function logDate(): DeliveryLogDate
    {
        return $this->logDate;
    }

    public function deliveryDate(): DeliveryDate
    {
        return $this->deliveryDate;
    }

    public function shippingPrice(): DeliveryShippingPrice
    {
        return $this->shippingPrice;
    }

    public function finalPrice(): DeliveryFinalPrice
    {
        return $this->finalPrice;
    }

    public function guide(): DeliveryGuide
    {
        return $this->guide;
    }

    public function status(): DeliveryStatus
    {
        return $this->status;
    }

    // Update status
    public function markAsCancelled(): void
    {
        $this->status = new DeliveryStatus('cancelled');
    }
}
