<?php

namespace Src\Catalog\Client\Domain\Entities;

use Src\Catalog\Client\Domain\ValueObjects\ClientId;
use Src\Catalog\Client\Domain\ValueObjects\ClientName;
use Src\Catalog\Client\Domain\ValueObjects\ClientAddress;
use Src\Catalog\Client\Domain\ValueObjects\ClientPhone;
use Src\Catalog\Client\Domain\ValueObjects\ClientEmail;
use Src\Catalog\Client\Domain\ValueObjects\ClientType;

class Client {
    private ClientId $id;
    private ClientName $fullName;
    private ClientAddress $address;
    private ClientPhone $phone;
    private ClientEmail $email;
    private ClientType $type;
    private bool $active;

    public function __construct(
        ClientId $id,
        ClientName $fullName,
        ClientEmail $email,
        ClientAddress $address,
        ClientPhone $phone,
        ClientType $type,
        bool $active = true
    ) {
        $this->id = $id;
        $this->fullName = $fullName;
        $this->address = $address;
        $this->phone = $phone;
        $this->email = $email;
        $this->type = $type;
        $this->active = $active;
    }

    public function id(): ClientId { return $this->id; }
    public function fullName(): ClientName { return $this->fullName; }
    public function address(): ClientAddress { return $this->address; }
    public function phone(): ClientPhone { return $this->phone; }
    public function email(): ClientEmail { return $this->email; }
    public function type(): ClientType { return $this->type; }
    public function isActive(): bool { return $this->active; }

    public function toggleActive(): void
    {
        $this->active = !$this->active;
    }

}
