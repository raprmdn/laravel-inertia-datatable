<?php

namespace App\Http\Resources\App;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'email_verified_at' => $this->email_verified_at ? new CarbonResource($this->email_verified_at) : null,
            'roles' => RoleResource::collection($this->whenLoaded('roles')),
            'created_at' => $this->created_at ? new CarbonResource($this->created_at) : null,
            'updated_at' => $this->updated_at ? new CarbonResource($this->updated_at) : null,
        ];
    }
}
