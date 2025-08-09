<?php

namespace Src\Catalog\Product\Domain\Contracts;

use Src\Catalog\Product\Domain\Entities\Product;
use Src\Catalog\Product\Domain\ValueObjects\ProductId;

interface ProductRepositoryInterface
{
    public function insert(Product $product): void;
    public function update(Product $product): void;
    public function findById(ProductId $id): ?Product;
    public function findAll(): array;
    public function delete(ProductId $id): void;
}
