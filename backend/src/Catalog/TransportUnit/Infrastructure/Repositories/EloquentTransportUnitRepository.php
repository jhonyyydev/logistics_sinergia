<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Repositories;

use App\Models\TransportUnit as EloquentTransportUnit;
use Src\Catalog\TransportUnit\Domain\Contracts\TransportUnitRepositoryInterface;
use Src\Catalog\TransportUnit\Domain\Entities\TransportUnit as DomainTransportUnit;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitId;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitIdentifier;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitType;
use Src\Catalog\TransportUnit\Domain\ValueObjects\TransportUnitActive;

final class EloquentTransportUnitRepository implements TransportUnitRepositoryInterface
{
    public function save(DomainTransportUnit $unit): void
    {
        EloquentTransportUnit::create([
            'id' => $unit->id()->value(),
            'identifier' => $unit->identifier()->value(),
            'unit_type' => $unit->type()->value(),
            'active' => $unit->isActive()->value()
        ]);
    }

    public function update(DomainTransportUnit $unit): void
    {
        EloquentTransportUnit::where('id', $unit->id()->value())->update([
            'identifier' => $unit->identifier()->value(),
            'unit_type' => $unit->type()->value(),
            'active' => $unit->isActive()->value()
        ]);
    }

    public function findById(TransportUnitId $id): ?DomainTransportUnit
    {
        $model = EloquentTransportUnit::find($id->value());
        return $model ? $this->mapToDomain($model) : null;
    }

    public function findAll(): array
    {
        return EloquentTransportUnit::all()
            ->map(fn($model) => $this->mapToDomain($model))
            ->toArray();
    }

    public function deactivate(TransportUnitId $id): void
    {
        $unit = EloquentTransportUnit::find($id->value());

        if ($unit) {
            $unit->active = !$unit->active; // Cambia true -> false o false -> true
            $unit->save();
        }
    }

    public function findAllForSelect(): array
    {
        return \App\Models\TransportUnit::select('id', 'unit_type', 'identifier')->get()->toArray();
    }


    private function mapToDomain(EloquentTransportUnit $model): DomainTransportUnit
    {
        return new DomainTransportUnit(
            new TransportUnitId($model->id),
            new TransportUnitIdentifier($model->identifier, $model->unit_type),
            new TransportUnitType($model->unit_type),
            new TransportUnitActive($model->active)
        );
    }
}
