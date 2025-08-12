<?php

namespace Src\Catalog\Destination\Infrastructure\Repositories;

use App\Models\Destination as EloquentDestination;
use Src\Catalog\Destination\Domain\Contracts\DestinationRepositoryInterface;
use Src\Catalog\Destination\Domain\Entities\Destination as DomainDestination;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationName;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationLocation;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationCapacity;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationType;

final class EloquentDestinationRepository implements DestinationRepositoryInterface
{
    public function insert(DomainDestination $destination): void
    {
        EloquentDestination::create([
            'id'               => $destination->id()->value(),
            'name'             => $destination->name()->value(),
            'location'         => $destination->location()->value(),
            'capacity'         => $destination->capacity()->value(),
            'destination_type' => $destination->type()->value()
        ]);
    }

    public function update(DomainDestination $destination): void
    {
        EloquentDestination::where('id', $destination->id()->value())->update([
            'name'             => $destination->name()->value(),
            'location'         => $destination->location()->value(),
            'capacity'         => $destination->capacity()->value(),
            'destination_type' => $destination->type()->value()
        ]);
    }

    public function findById(DestinationId $id): ?DomainDestination
    {
        $model = EloquentDestination::find($id->value());
        return $model ? $this->mapToDomain($model) : null;
    }

    public function findAll(): array
    {
        return EloquentDestination::all()
            ->map(fn($model) => $this->mapToDomain($model))
            ->toArray();
    }

    public function delete(DestinationId $id): void
    {
        EloquentDestination::destroy($id->value());
    }

    public function findAllForSelect(): array
    {
        return \App\Models\Destination::select('id', 'name', 'destination_type')->get()->toArray();
    }

    private function mapToDomain(EloquentDestination $model): DomainDestination
    {
        return new DomainDestination(
            new DestinationId($model->id),
            new DestinationName($model->name),
            new DestinationLocation($model->location),
            new DestinationCapacity($model->capacity),
            new DestinationType($model->destination_type)
        );
    }
}
