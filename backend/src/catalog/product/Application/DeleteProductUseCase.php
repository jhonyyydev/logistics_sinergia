<?php

namespace Src\Catalog\Product\Application;

use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;
use Src\Catalog\Product\Domain\ValueObjects\ProductId;

final class DeleteProductUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(int $id): void
    {
        $productId = new ProductId($id);

        $existingProduct = $this->repository->findById($productId);
        if (!$existingProduct) {
            throw new \InvalidArgumentException("Product not found");
        }

        $this->repository->delete($productId);
    }
}
