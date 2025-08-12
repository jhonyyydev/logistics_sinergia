<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'product_type',
        'quantity',
        'log_date',
        'delivery_date',
        'shipping_price',
        'final_price',
        'guide',
        'delivery_type',
    ];

    /**
     * Relaciones
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function transportDelivery()
    {
        return $this->hasOne(TransportDelivery::class);
    }
}
