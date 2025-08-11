<?php

namespace Src\Logistics\Delivery\Domain\ValueObjects;

final class DeliveryType
{
    private string $type;

    public function __construct(string $type)
    {
        $validTypes = ['terrestrial', 'maritime'];
        if (!in_array($type, $validTypes, true)) {
            throw new \InvalidArgumentException(
                'Invalid delivery type. Allowed: terrestrial, maritime'
            );
        }
        $this->type = $type;
    }

    public function value(): string
    {
        return $this->type;
    }
}
