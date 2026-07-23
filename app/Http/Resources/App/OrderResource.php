<?php

namespace App\Http\Resources\App;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'reference' => $this->reference,
            'status' => $this->when(
                array_key_exists('status', $this->resource->getAttributes()),
                fn () => $this->status?->value,
            ),
            'payment_status' => $this->when(
                array_key_exists('payment_status', $this->resource->getAttributes()),
                fn () => $this->payment_status?->value,
            ),
            'total_amount' => $this->when(
                array_key_exists('total_amount', $this->resource->getAttributes()),
                fn () => $this->total_amount,
            ),
            'placed_at' => $this->placed_at?->toJSON(),
            'shipped_at' => $this->whenHas('shipped_at', fn () => $this->shipped_at?->toJSON()),
            'source' => $this->whenHas('metadata', fn () => data_get($this->metadata, 'source')),
            'flags' => $this->whenHas('metadata', fn (): array => array_values(
                data_get($this->metadata, 'flags', []),
            )),
            'customer' => $this->whenLoaded('customer', fn (): ?array => $this->customer ? [
                'id' => $this->customer->id,
                'customer_number' => $this->customer->customer_number,
                'name' => $this->customer->name,
            ] : null),
            'company' => $this->when(
                $this->relationLoaded('customer') && $this->customer?->relationLoaded('company'),
                fn (): ?array => $this->customer?->company ? [
                    'id' => $this->customer->company->id,
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
                'id' => $this->agent->id,
                'name' => $this->agent->name,
            ] : null),
            'items_count' => $this->whenCounted('items'),
        ];
    }
}
