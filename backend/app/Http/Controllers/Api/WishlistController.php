<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function index()
    {
        $wishlist = Auth::user()->wishlist()->get();
        return GameResource::collection($wishlist);
    }

    public function toggle(Game $game)
    {
        $user = Auth::user();
        
        if ($user->wishlist()->where('game_id', $game->id)->exists()) {
            $user->wishlist()->detach($game->id);
            $message = 'Removed from wishlist';
            $added = false;
        } else {
            $user->wishlist()->attach($game->id);
            $message = 'Added to wishlist';
            $added = true;
        }

        return response()->json([
            'message' => $message,
            'added' => $added,
            'wishlist_count' => $user->wishlist()->count()
        ]);
    }

    public function check(Game $game)
    {
        $inWishlist = Auth::user()->wishlist()
            ->where('game_id', $game->id)
            ->exists();
            
        return response()->json(['in_wishlist' => $inWishlist]);
    }
}