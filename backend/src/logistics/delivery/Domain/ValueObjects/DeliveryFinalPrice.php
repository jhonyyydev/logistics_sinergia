<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryFinalPrice
{
    private float $finalPrice;

    private function __construct(float $finalPrice)
    {
        if ($finalPrice < 0) {
            throw new \InvalidArgumentException('Final price cannot be negative.');
        }
        $this->finalPrice = round($finalPrice, 2);
    }

    public static function fromPricingRules(
        DeliveryType $deliveryType,
        float $shippingPrice,
        int $quantity
    ): self {
        $discount = 0;

        if ($quantity > 10) {
            $discount = match ($deliveryType->value()) {
                'terrestrial' => 0.05, // 5%
                'maritime' => 0.03,  // 3%
                default => 0
            };
        }

        $finalPrice = $shippingPrice - ($shippingPrice * $discount);

        return new self($finalPrice);
    }

    public function value(): float
    {
        return $this->finalPrice;
    }
}
