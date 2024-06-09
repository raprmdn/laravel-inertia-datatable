<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin \App\Models\Post */
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'user_id'    => $this->user_id,
            'title'      => $this->title,
            'slug'       => $this->slug,
            'excerpt'    => $this->excerpt,
            'content'    => $this->content,
            'status'     => strtoupper($this->status),
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'user'       => $this->whenLoaded('user', fn() => new UserResource($this->user)),
            'categories' => $this->whenLoaded('categories', fn() => CategoryResource::collection($this->categories)),
        ];
    }
}
