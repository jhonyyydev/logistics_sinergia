<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryFinalPrice {
    public function __construct(private float $value) {
        if ($value <= 0) throw new \InvalidArgumentException("Final price must be positive");
    }
    public function value(): float { return $this->value; }

    public static function fromPricingRules(DeliveryType $type, float $shippingPrice, int $quantity): self {
        $discount = 0;
        if ($type->value() === 'maritime' && $quantity > 10) {
            $discount = 0.03; // 3%
        } elseif ($type->value() === 'terrestrial' && $quantity > 10) {
            $discount = 0.05; // 5%
        }
        $finalPrice = $shippingPrice - ($shippingPrice * $discount);
        return new self(round($finalPrice, 2));
    }
}
