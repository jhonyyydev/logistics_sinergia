<?php

namespace Src\Logistics\Delivery\Domain\Entities;

use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryId;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryUserId;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryProductId;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryProductType;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryQuantity;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryLogDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryShippingPrice;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryFinalPrice;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryGuide;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryType;

final class Delivery
{
    public function __construct(
        private DeliveryId $id,
        private DeliveryUserId $userId,
        private DeliveryProductId $productId,
        private DeliveryProductType $productType,
        private DeliveryQuantity $quantity,
        private DeliveryLogDate $logDate,
        private DeliveryDate $deliveryDate,
        private DeliveryShippingPrice $shippingPrice,
        private DeliveryFinalPrice $finalPrice,
        private DeliveryGuide $guide,
        private DeliveryType $deliveryType
    ) {}

    public static function createWithCalculatedPrice(
        DeliveryId $id,
        DeliveryUserId $userId,
        DeliveryProductId $productId,
        DeliveryProductType $productType,
        DeliveryQuantity $quantity,
        DeliveryLogDate $logDate,
        DeliveryDate $deliveryDate,
        DeliveryShippingPrice $shippingPrice,
        DeliveryGuide $guide,
        DeliveryType $deliveryType
    ): self {
        $finalPrice = DeliveryFinalPrice::fromPricingRules(
            $deliveryType,
            $shippingPrice->value(),
            $quantity->value()
        );

        return new self(
            $id,
            $userId,
            $productId,
            $productType,
            $quantity,
            $logDate,
            $deliveryDate,
            $shippingPrice,
            $finalPrice,
            $guide,
            $deliveryType
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
    public function id(): DeliveryId { return $this->id; }
    public function userId(): DeliveryUserId { return $this->userId; }
    public function productId(): DeliveryProductId { return $this->productId; }
    public function productType(): DeliveryProductType { return $this->productType; }
    public function quantity(): DeliveryQuantity { return $this->quantity; }
    public function logDate(): DeliveryLogDate { return $this->logDate; }
    public function deliveryDate(): DeliveryDate { return $this->deliveryDate; }
    public function shippingPrice(): DeliveryShippingPrice { return $this->shippingPrice; }
    public function finalPrice(): DeliveryFinalPrice { return $this->finalPrice; }
    public function guide(): DeliveryGuide { return $this->guide; }
    public function deliveryType(): DeliveryType { return $this->deliveryType; }
}
