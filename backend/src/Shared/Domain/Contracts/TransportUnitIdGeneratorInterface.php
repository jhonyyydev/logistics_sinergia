<?php

namespace Src\Shared\Domain\Contracts;

interface TransportUnitIdGeneratorInterface
{
    public function generate(): int;
}
