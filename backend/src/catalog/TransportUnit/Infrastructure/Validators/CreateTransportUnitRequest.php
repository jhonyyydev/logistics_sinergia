<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

final class CreateTransportUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => 'required|string|max:50',
            'unit_type' => 'required|string|in:fleet,vehicle',
            'active' => 'required|boolean'
        ];
    }
}
