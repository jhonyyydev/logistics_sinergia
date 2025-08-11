<?php

namespace Src\Catalog\Product\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => 'sometimes|required|string|min:3|max:255',
            'description'    => 'nullable|string|min:3',
            'type'           => 'sometimes|required|string|in:terrestrial,maritime', // too could be 'air' or 'rail'
            'date_creation'  => 'sometimes|required|date'
        ];
    }
}
