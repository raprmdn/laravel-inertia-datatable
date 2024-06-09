<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\User */
class UserResource extends JsonResource
{
	public function toArray(Request $request): array
	{
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'is_verified_email' => (bool) $this->email_verified_at,
            'created_at'        => $this->created_at->format('Y-m-d H:i A'),
            'roles'             => $this->whenLoaded('roles', function () {
                return RoleResource::collection($this->roles);
            }),
        ];
	}
}
