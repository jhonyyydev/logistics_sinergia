<?php

namespace Src\Catalog\Destination\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateDestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'             => 'sometimes|required|string|min:3|max:255',
            'location'         => 'sometimes|required|string|min:3|max:255',
            'capacity'         => 'nullable|integer|min:0',
            'destination_type' => 'sometimes|required|string|in:warehouse_land,seaport'
        ];
    }
}
