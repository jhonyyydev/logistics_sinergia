<?php

namespace Src\Catalog\Product\Application;

use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;
use Src\Catalog\Product\Domain\ValueObjects\ProductId;

final class FindProductByIdUseCase
{
    public function __construct(
        private ProductRepositoryInterface $repository
    ) {}

    public function execute(int $id): ?array
    {
        $productId = new ProductId($id);
        $product = $this->repository->findById($productId);

        if (!$product) {
            return null;
        }

        return [
            'id'            => $product->id()->value(),
            'name'          => $product->name()->value(),
            'description'   => $product->description()->value(),
            'type'          => $product->type()->value(),
            'date_creation' => $product->dateCreation()->value(),
        ];
    }
}
