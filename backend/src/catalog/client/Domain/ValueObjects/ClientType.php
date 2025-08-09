<?php

namespace Src\Catalog\Client\Domain\ValueObjects;

class ClientType
{
    private string $value;

    public function __construct(string $value)
    {
        $allowed = ['nacional', 'internacional'];
        if (!in_array(strtolower($value), $allowed, true)) {
            throw new \InvalidArgumentException("Invalid client type: must be 'nacional' or 'internacional'");
        }
        $this->value = strtolower($value);
    }

    public function value(): string
    {
        return $this->value;
    }
}
