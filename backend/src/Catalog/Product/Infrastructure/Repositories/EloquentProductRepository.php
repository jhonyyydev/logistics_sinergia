<?php

namespace Src\Catalog\Product\Infrastructure\Repositories;

use App\Models\Product as EloquentProduct;
use Src\Catalog\Product\Domain\Contracts\ProductRepositoryInterface;
use Src\Catalog\Product\Domain\Entities\Product as DomainProduct;
use Src\Catalog\Product\Domain\ValueObjects\ProductId;
use Src\Catalog\Product\Domain\ValueObjects\ProductName;
use Src\Catalog\Product\Domain\ValueObjects\ProductDescription;
use Src\Catalog\Product\Domain\ValueObjects\ProductType;
use Src\Catalog\Product\Domain\ValueObjects\ProductDateCreation;

final class EloquentProductRepository implements ProductRepositoryInterface
{
    public function insert(DomainProduct $product): void
    {
        EloquentProduct::create([
            'id'             => $product->id()->value(),
            'name'           => $product->name()->value(),
            'description'    => $product->description()->value(),
            'type'           => $product->type()->value(),
            'date_creation'  => $product->dateCreation()->value(),
        ]);
    }

    public function update(DomainProduct $product): void
    {
        EloquentProduct::where('id', $product->id()->value())->update([
            'name'           => $product->name()->value(),
            'description'    => $product->description()->value(),
            'type'           => $product->type()->value(),
            'date_creation'  => $product->dateCreation()->value(),
        ]);
    }

    public function findById(ProductId $id): ?DomainProduct
    {
        $model = EloquentProduct::find($id->value());
        return $model ? $this->mapToDomain($model) : null;
    }

    public function findAll(): array
    {
        return EloquentProduct::all()
            ->map(fn($model) => $this->mapToDomain($model))
            ->toArray();
    }

    public function delete(ProductId $id): void
    {
        EloquentProduct::destroy($id->value());
    }

    private function mapToDomain(EloquentProduct $model): DomainProduct
    {
        return new DomainProduct(
            new ProductId($model->id),
            new ProductName($model->name),
            new ProductDescription($model->description),
            new ProductType($model->type),
            new ProductDateCreation($model->date_creation)
        );
    }

    public function findAllForSelect(): array
    {
        return \App\Models\Product::select('id', 'name', 'type')->get()->toArray();
    }
}
