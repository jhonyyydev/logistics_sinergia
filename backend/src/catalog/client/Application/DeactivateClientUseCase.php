<?php

namespace Src\Catalog\Client\Application;

use Src\Catalog\Client\Domain\Contracts\ClientRepositoryInterface;
use Src\Catalog\Client\Domain\ValueObjects\ClientId;

final class DeactivateClientUseCase
{
    public function __construct(
        private ClientRepositoryInterface $repository
    ) {}

    public function execute(ClientId $id): void
    {
        $this->repository->deactivate($id);
    }
}
