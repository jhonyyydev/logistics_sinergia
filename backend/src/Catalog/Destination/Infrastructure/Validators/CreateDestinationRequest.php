<?php

namespace Src\Catalog\Destination\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

final class CreateDestinationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'             => 'required|string|min:3|max:255',
            'location'         => 'required|string|min:3|max:255',
            'capacity'         => 'nullable|integer|min:0',
            'destination_type' => 'required|string|in:warehouse_land,seaport'
        ];
    }
}
