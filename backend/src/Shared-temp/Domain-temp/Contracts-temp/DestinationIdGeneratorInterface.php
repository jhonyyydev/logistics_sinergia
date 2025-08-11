<?php

namespace Src\Shared\Domain\Contracts;

interface DestinationIdGeneratorInterface
{
    public function generate(): int;
}
