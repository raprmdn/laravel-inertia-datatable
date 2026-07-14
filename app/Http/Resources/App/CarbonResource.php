<?php

namespace App\Http\Resources\App;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CarbonResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'date' => $this->toDateString(),
            'time' => $this->toTimeString(),
            'l' => $this->translatedFormat('l'),
            'd' => $this->format('d'),
            'M' => $this->translatedFormat('M'),
            'F' => $this->translatedFormat('F'),
            'Y' => $this->format('Y'),
            'Hi' => $this->format('H:i'),
            'diffForHumans' => $this->diffForHumans(),
            'dFY' => $this->format('d F Y'),
            'dFY_tf' => $this->translatedFormat('d F Y'),
        ];
    }
}
