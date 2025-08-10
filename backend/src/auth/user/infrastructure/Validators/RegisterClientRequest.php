<?php

namespace Src\Auth\User\Infrastructure\Validators;

use Illuminate\Foundation\Http\FormRequest;

class RegisterClientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => 'required|min:3|max:255',
            'email'    => 'required|email|unique:users,email',
            'address'  => 'nullable|max:255',
            'phone'    => 'nullable|max:20',
            'type'     => 'nullable|in:nacional,international,national',
            'password' => 'required|min:6'
        ];
    }
}
