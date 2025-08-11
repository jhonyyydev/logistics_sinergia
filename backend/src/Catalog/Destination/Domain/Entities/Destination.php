<?php

namespace Src\Catalog\Destination\Domain\Entities;

use Src\Catalog\Destination\Domain\ValueObjects\DestinationId;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationName;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationLocation;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationCapacity;
use Src\Catalog\Destination\Domain\ValueObjects\DestinationType;

class Destination
{
    private DestinationId $id;
    private DestinationName $name;
    private DestinationLocation $location;
    private DestinationCapacity $capacity;
    private DestinationType $type;

    public function __construct(
        DestinationId $id,
        DestinationName $name,
        DestinationLocation $location,
        DestinationCapacity $capacity,
        DestinationType $type
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->location = $location;
        $this->capacity = $capacity;
        $this->type = $type;
    }

    public function id(): DestinationId { return $this->id; }
    public function name(): DestinationName { return $this->name; }
    public function location(): DestinationLocation { return $this->location; }
    public function capacity(): DestinationCapacity { return $this->capacity; }
    public function type(): DestinationType { return $this->type; }
}
