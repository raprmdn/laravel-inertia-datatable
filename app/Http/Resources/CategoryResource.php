<?php

namespace App\Http\Resources;

use App\Http\Resources\App\CarbonResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
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
            'slug' => $this->slug,
            'posts_count' => $this->posts_count,
            'created_at' => new CarbonResource($this->created_at),
        ];
    }
}
