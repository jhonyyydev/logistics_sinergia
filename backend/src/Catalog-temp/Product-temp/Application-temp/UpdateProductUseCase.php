<?php

namespace Src\Catalog\Product\Application;

use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;
use Src\Catalog\Product\Domain\Entities\Product;
use Src\Catalog\Product\Domain\ValueObjects\ProductId;
use Src\Catalog\Product\Domain\ValueObjects\ProductName;
use Src\Catalog\Product\Domain\ValueObjects\ProductDescription;
use Src\Catalog\Product\Domain\ValueObjects\ProductType;
use Src\Catalog\Product\Domain\ValueObjects\ProductDateCreation;

final class UpdateProductUseCase
{
    public function __construct(
        private ProductRepositoryInterface $repository
    ) {}

    public function execute(
        int $id,
        ?string $name,
        ?string $description,
        ?string $type,
        ?string $dateCreation
    ): void {
        $productId = new ProductId($id);

        $existingProduct = $this->repository->findById($productId);
        if (!$existingProduct) {
            throw new \InvalidArgumentException("Product not found");
        }

        $updatedProduct = new Product(
            $productId,
            new ProductName($name ?? $existingProduct->name()->value()),
            new ProductDescription($description ?? $existingProduct->description()->value()),
            new ProductType($type ?? $existingProduct->type()->value()),
            new ProductDateCreation($dateCreation ?? $existingProduct->dateCreation()->value())
        );

        $this->repository->update($updatedProduct);
    }
}
