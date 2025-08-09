<?php

namespace Src\Shared\Domain\Contracts;

interface IdGeneratorInterface
{
    public function generate(): int;
}
