<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'discount',
        'rating',
        'category',
        'platform',
        'developer',
        'publisher',
        'release_date',
        'image_url',
        'screenshots',
        'video_url',
        'tags',
        'age_rating',
        'is_featured',
        'is_trending'
    ];

    protected $casts = [
        'screenshots' => 'array',
        'tags' => 'array',
        'release_date' => 'date',
        'price' => 'decimal:2',
        'discount' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean'
    ];

    public function getDiscountedPriceAttribute()
    {
        return $this->price * (1 - $this->discount / 100);
    }

    public function getIsOnSaleAttribute()
    {
        return $this->discount > 0;
    }

    public function carts()
    {
        return $this->belongsToMany(Cart::class, 'cart_items')
                    ->withPivot('quantity')
                    ->withTimestamps();
    }

    public function wishlists()
    {
        return $this->belongsToMany(User::class, 'wishlists');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeTrending($query)
    {
        return $query->where('is_trending', true);
    }

    public function scopeOnSale($query)
    {
        return $query->where('discount', '>', 0);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('title', 'like', "%{$search}%")
                     ->orWhere('description', 'like', "%{$search}%")
                     ->orWhere('developer', 'like', "%{$search}%");
    }
}