<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price' => $this->price,
            'discount' => $this->discount,
            'rating' => $this->rating,
            'category' => $this->category,
            'platform' => $this->platform,
            'developer' => $this->developer,
            'publisher' => $this->publisher,
            'release_date' => $this->release_date,
            'image_url' => $this->image_url,
            'screenshots' => $this->screenshots,
            'video_url' => $this->video_url,
            'tags' => $this->tags,
            'age_rating' => $this->age_rating,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

