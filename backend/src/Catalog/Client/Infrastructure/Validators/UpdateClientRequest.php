<?php

namespace Src\Catalog\Client\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'sometimes|required|min:3|max:255',
            'email'    => 'sometimes|required|email|unique:users,email,' . $this->route('id'),
            'address'  => 'nullable|max:255',
            'phone'    => 'nullable|max:20',
            'type'     => 'nullable|in:national,international',
            'active'   => 'nullable|boolean'
        ];
    }
}
