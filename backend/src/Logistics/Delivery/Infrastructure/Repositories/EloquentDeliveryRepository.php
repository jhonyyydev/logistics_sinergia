<?php

namespace Src\Logistics\Delivery\Infrastructure\Repositories;

use Src\Logistics\Delivery\Domain\Contracts\DeliveryRepositoryInterface;
use Src\Logistics\Delivery\Domain\Entities\Delivery;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryId;
use App\Models\Delivery as EloquentDelivery;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryFinalPrice;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryGuide;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryLogDate;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryProductId;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryProductType;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryQuantity;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryShippingPrice;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryType;
use Src\Logistics\Delivery\Domain\ValueObjects\DeliveryUserId;

final class EloquentDeliveryRepository implements DeliveryRepositoryInterface
{
    public function createAndReturnId(Delivery $delivery): int
    {
        $attributes = $this->mapToEloquentAttributes($delivery);

        $model = EloquentDelivery::create($attributes);

        return $model->id;
    }

    public function findAll(): array
    {
        return EloquentDelivery::all()->toArray();
    }

    public function update(Delivery $delivery): void
    {
        $attributes = $this->mapToEloquentAttributes($delivery);

        EloquentDelivery::where('id', $delivery->id()->value())->update($attributes);
    }

    public function findById(DeliveryId $id): ?Delivery
    {
        $model = EloquentDelivery::find($id->value());
        return $model ? $this->mapToDomain($model) : null;
    }

    private function mapToEloquentAttributes(Delivery $delivery): array
    {
        return [
            'id'             => $delivery->id()->value(),
            'user_id'        => $delivery->userId()->value(),
            'product_id'     => $delivery->productId()->value(),
            'product_type'   => $delivery->productType()->value(),
            'quantity'       => $delivery->quantity()->value(),
            'log_date'       => $delivery->logDate()->value()->format('Y-m-d'),
            'delivery_date'  => $delivery->deliveryDate()->value()->format('Y-m-d'),
            'shipping_price' => $delivery->shippingPrice()->value(),
            'final_price'    => $delivery->finalPrice()->value(),
            'guide'          => $delivery->guide()->value(),
            'delivery_type'  => $delivery->deliveryType()->value(),
        ];
    }

    /**
     * Map Eloquent model → Domain entity
     */
    private function mapToDomain(EloquentDelivery $model): Delivery
    {
        return new Delivery(
            new DeliveryId($model->id),
            new DeliveryUserId($model->user_id),
            new DeliveryProductId($model->product_id),
            new DeliveryProductType($model->product_type),
            new DeliveryQuantity($model->quantity),
            new DeliveryLogDate($model->log_date),
            new DeliveryDate(new \DateTimeImmutable($model->delivery_date)),
            new DeliveryShippingPrice($model->shipping_price),
            new DeliveryFinalPrice($model->final_price),
            new DeliveryGuide($model->guide),
            new DeliveryType($model->delivery_type)
        );
    }

    public function findAllWithRelations(): array
    {
        return EloquentDelivery::with([
            'user', // relación con el cliente
            'transportDelivery.transportUnit',
            'transportDelivery.destination'
        ])
        ->get()
        ->map(function ($model) {
            return [
                'id'             => $model->id,
                'user'           => [
                    'id'    => $model->user?->id,
                    'name'  => $model->user?->name,
                    'email' => $model->user?->email,
                ],
                'product_id'     => $model->product_id,
                'product_type'   => $model->product_type,
                'quantity'       => $model->quantity,
                'log_date'       => $model->log_date,
                'delivery_date'  => $model->delivery_date,
                'shipping_price' => $model->shipping_price,
                'final_price'    => $model->final_price,
                'guide'          => $model->guide,
                'delivery_type'  => $model->delivery_type,
                'transport_unit' => [
                    'id'         => $model->transportDelivery?->transportUnit?->id,
                    'identifier' => $model->transportDelivery?->transportUnit?->identifier,
                ],
                'destination'    => [
                    'id'       => $model->transportDelivery?->destination?->id,
                    'name'     => $model->transportDelivery?->destination?->name,
                    'location' => $model->transportDelivery?->destination?->location,
                ]
            ];
        })
        ->toArray();
    }


}
