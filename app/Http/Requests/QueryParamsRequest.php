<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class QueryParamsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'search'  => ['nullable', 'string'],
            'limit'   => ['nullable', 'integer'],
            'col'     => ['nullable', 'string'],
            'sort'    => ['nullable', 'string', 'in:asc,desc'],
            'filters' => ['nullable', 'array'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
