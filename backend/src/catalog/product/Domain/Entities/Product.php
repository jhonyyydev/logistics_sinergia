<?php

namespace Src\Catalog\Product\Domain\Entities;

use Src\Catalog\Product\Domain\ValueObjects\ProductId;
use Src\Catalog\Product\Domain\ValueObjects\ProductName;
use Src\Catalog\Product\Domain\ValueObjects\ProductDescription;
use Src\Catalog\Product\Domain\ValueObjects\ProductType;
use Src\Catalog\Product\Domain\ValueObjects\ProductDateCreation;

class Product
{
    private ProductId $id;
    private ProductName $name;
    private ProductDescription $description;
    private ProductType $type;
    private ProductDateCreation $dateCreation;

    public function __construct(
        ProductId $id,
        ProductName $name,
        ProductDescription $description,
        ProductType $type,
        ProductDateCreation $dateCreation
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->type = $type;
        $this->dateCreation = $dateCreation;
    }

    public function id(): ProductId { return $this->id; }
    public function name(): ProductName { return $this->name; }
    public function description(): ProductDescription { return $this->description; }
    public function type(): ProductType { return $this->type; }
    public function dateCreation(): ProductDateCreation { return $this->dateCreation; }
}
