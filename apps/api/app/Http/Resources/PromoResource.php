<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PromoResource extends JsonResource
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
            'banner_url' => $this->banner ? asset('storage/' . $this->banner) : null,
            'description' => $this->description,
            'discount_percentage' => $this->discount_percentage,
            'min_order_value' => $this->min_order_value,
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date->format('Y-m-d'),
            'status' => $this->status,
            'applies_to' => $this->applies_to,
            'applies_to_product' => $this->applies_to_product,

            // Relasi (kalau mau ditampilkan)
            'stores' => $this->whenLoaded('stores', function () {
                return $this->stores->map(function ($store) {
                    return [
                        'id' => $store->id,
                        'name' => $store->name ?? null,
                    ];
                });
            }),
            'products' => $this->whenLoaded('products', function () {
                $discountPercentage = (float) $this->discount_percentage;
                return $this->products->map(function ($product) use ($discountPercentage) {
                    $price = (float) ($product->price ?? 0);
                    $discountedPrice = $price * (1 - $discountPercentage / 100);
                    return [
                        'id' => $product->id,
                        'name' => $product->name ?? null,
                        'price' => $product->price ?? null,
                        'discounted_price' => round($discountedPrice, 2),
                        'stock' => $product->stock ?? null,
                        'image_url' => $product->image_url ?? null,
                    ];
                });
            }),

        ];
    }
}
