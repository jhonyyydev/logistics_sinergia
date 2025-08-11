<?php

namespace Src\Catalog\TransportUnit\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

final class UpdateTransportUnitRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => 'sometimes|required|string|max:50',
            'unit_type' => 'sometimes|required|string|in:fleet,vehicle',
            'active' => 'sometimes|required|boolean'
        ];
    }
}
