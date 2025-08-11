<?php

namespace Src\Catalog\Product\Application;

use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;
use Src\Catalog\Product\Domain\Entities\Product;
use Src\Catalog\Product\Domain\ValueObjects\ProductId;
use Src\Catalog\Product\Domain\ValueObjects\ProductName;
use Src\Catalog\Product\Domain\ValueObjects\ProductDateCreation;
use Src\Catalog\Product\Domain\ValueObjects\ProductDescription;
use Src\Catalog\Product\Domain\ValueObjects\ProductType;
use Src\Shared\Domain\Contracts\ProductIdGeneratorInterface;

final class CreateProductUseCase
{
    public function __construct(
        private ProductRepositoryInterface $repository,
        private ProductIdGeneratorInterface $idGenerator
    ) {}

    public function execute(
        string $name,
        ?string $description,
        string $type,
        string $dateCreation
    ): void {
        $rawId = $this->idGenerator->generate();
        $id = new ProductId($rawId);

        $product = new Product(
            $id,
            new ProductName($name),
            new ProductDescription($description),
            new ProductType($type),
            new ProductDateCreation($dateCreation)
        );

        $this->repository->insert($product);
    }
}
