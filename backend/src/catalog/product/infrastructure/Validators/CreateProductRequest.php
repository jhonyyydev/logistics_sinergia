<?php

namespace Src\Catalog\Product\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

final class CreateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'           => 'required|string|min:3|max:255',
            'description'    => 'nullable|string|min:3',
            'type'           => 'required|string|in:terrestrial,maritime', // too could be 'air' or 'rail'
            'date_creation'  => 'required|date'
        ];
    }
}
