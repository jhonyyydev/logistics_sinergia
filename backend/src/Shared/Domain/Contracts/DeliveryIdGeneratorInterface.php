<?php

namespace Src\Shared\Domain\Contracts;

interface DeliveryIdGeneratorInterface
{
    public function generate(): int;
}
