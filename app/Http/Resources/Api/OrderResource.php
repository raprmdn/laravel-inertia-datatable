<?php

namespace App\Http\Resources\Api;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'order_number' => $this->order_number,
            'reference' => $this->reference,
            'status' => $this->status->value,
            'payment_status' => $this->payment_status->value,
            'total_amount' => $this->total_amount,
            'placed_at' => $this->placed_at->toJSON(),
            'shipped_at' => $this->shipped_at?->toJSON(),
            'customer' => $this->whenLoaded('customer', fn (): ?array => $this->customer ? [
                'id' => (string) $this->customer->id,
                'name' => $this->customer->name,
            ] : null),
            'company' => $this->when(
                $this->relationLoaded('customer') && $this->customer?->relationLoaded('company'),
                fn (): ?array => $this->customer?->company ? [
                    'id' => (string) $this->customer->company->id,
                    'name' => $this->customer->company->name,
                ] : null,
            ),
            'country' => $this->when(
                $this->relationLoaded('customer')
                    && $this->customer?->relationLoaded('company')
                    && $this->customer?->company?->relationLoaded('country'),
                fn (): ?array => $this->customer?->company?->country ? [
                    'code' => $this->customer->company->country->code,
                    'name' => $this->customer->company->country->name,
                ] : null,
            ),
            'agent' => $this->whenLoaded('agent', fn (): ?array => $this->agent ? [
                'id' => (string) $this->agent->id,
                'name' => $this->agent->name,
            ] : null),
            'items_count' => (int) $this->items_count,
            'source' => data_get($this->metadata, 'source'),
            'flags' => array_values(data_get($this->metadata, 'flags', [])),
        ];
    }
}
