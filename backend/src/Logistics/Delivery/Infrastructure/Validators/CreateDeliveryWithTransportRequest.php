<?php

namespace Src\Logistics\Delivery\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

final class CreateDeliveryWithTransportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Delivery fields
            'user_id'        => 'required|exists:users,id',
            'product_id'     => 'required|exists:products,id',
            'product_type'   => 'required|string|max:50',
            'quantity'       => 'required|integer|min:1',
            'log_date'       => 'required|date',
            'delivery_date'  => 'required|date|after_or_equal:log_date',
            'shipping_price' => 'required|numeric|min:0',
            'guide'          => 'required|string|size:10|alpha_num|unique:deliveries,guide',
            'delivery_type'  => 'required|string|in:maritime,terrestrial',

            // Transport Delivery fields
            'transport_unit_id' => 'required|exists:transport_units,id',
            'destination_id'    => 'required|exists:destinations,id',
        ];
    }

    public function messages(): array
    {
        return [
            'guide.size'        => 'The guide must be exactly 10 characters.',
            'guide.alpha_num'   => 'The guide must only contain letters and numbers.',
            'delivery_type.in'  => 'Delivery type must be maritime or terrestrial.',
            'delivery_date.after_or_equal' => 'Delivery date must be after or equal to log date.',
        ];
    }
}
