<?php

namespace Src\Shared\Domain\Contracts;

interface ProductIdGeneratorInterface
{
    public function generate(): int;
}
