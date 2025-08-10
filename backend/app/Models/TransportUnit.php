<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransportUnit extends Model
{
    protected $table = 'transport_units';

    protected $fillable = [
        'identifier',
        'unit_type',
        'active'
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
