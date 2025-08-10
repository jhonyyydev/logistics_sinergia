<?php

namespace Src\Catalog\Product\Domain\ValueObjects;

use DateTime;

class ProductDateCreation
{
    private DateTime $value;

    public function __construct($date)
    {
        if ($date instanceof \DateTime) {
            $this->value = $date;
            return;
        }

        $parsed = \DateTime::createFromFormat('Y-m-d', $date);
        if (!$parsed) {
            throw new \InvalidArgumentException("Invalid product creation date format. Expected Y-m-d");
        }
        $this->value = $parsed;
    }

    public function value(): DateTime
    {
        return $this->value;
    }
}
