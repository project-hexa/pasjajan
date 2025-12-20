<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerVoucherResource extends JsonResource
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
            'voucher' => new VoucherResource($this->whenLoaded('voucher')),
            'redeemed_at' => $this->redeemed_at?->format('Y-m-d H:i:s'),
            'is_used' => $this->is_used,
            'used_at' => $this->used_at?->format('Y-m-d H:i:s'),
        ];
    }
}
