<?php

namespace Src\Catalog\Product\Application;

use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;

final class GetAllProductsUseCase
{
    public function __construct(
        private ProductRepositoryInterface $repository
    ) {}

    public function execute(): array
    {
        $products = $this->repository->findAll();

        return array_map(function ($product) {
            return [
                'id'            => $product->id()->value(),
                'name'          => $product->name()->value(),
                'description'   => $product->description()->value(),
                'type'          => $product->type()->value(),
                'date_creation' => $product->dateCreation()->value(),
            ];
        }, $products);
    }
}
