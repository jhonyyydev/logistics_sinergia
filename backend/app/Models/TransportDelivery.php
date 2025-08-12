<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransportDelivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'delivery_id',
        'transport_unit_id',
        'destination_id',
    ];

    /**
     * Relaciones
     */
    public function delivery()
    {
        // Como delivery_id es PK y FK, la relación es belongsTo
        return $this->belongsTo(Delivery::class);
    }

    public function transportUnit()
    {
        return $this->belongsTo(TransportUnit::class);
    }

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
