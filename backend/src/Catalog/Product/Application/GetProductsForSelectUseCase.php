<?php

namespace Src\Catalog\Product\Application;

use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;

final class GetProductsForSelectUseCase
{
    public function __construct(private ProductRepositoryInterface $repository) {}

    public function execute(): array
    {
        return $this->repository->findAllForSelect();
    }
}
