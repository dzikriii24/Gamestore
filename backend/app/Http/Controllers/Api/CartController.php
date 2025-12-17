<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Game;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = Auth::user()->cart()->with('games')->firstOrCreate([]);
        return new CartResource($cart);
    }

    public function addToCart(Request $request, Game $game)
    {
        $request->validate([
            'quantity' => 'integer|min:1',
        ]);

        $cart = Auth::user()->cart()->firstOrCreate([]);
        
        $cartItem = $cart->items()->where('game_id', $game->id)->first();
        
        if ($cartItem) {
            $cartItem->increment('quantity', $request->quantity ?? 1);
        } else {
            $cart->games()->attach($game->id, [
                'quantity' => $request->quantity ?? 1
            ]);
        }

        return new CartResource($cart->fresh());
    }

    public function updateQuantity(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Check if cart item belongs to user's cart
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return new CartResource($cartItem->cart->fresh());
    }

    public function removeFromCart(CartItem $cartItem)
    {
        // Check if cart item belongs to user's cart
        if ($cartItem->cart->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return new CartResource($cartItem->cart->fresh());
    }

    public function clear()
    {
        $cart = Auth::user()->cart()->first();
        
        if ($cart) {
            $cart->items()->delete();
        }

        return new CartResource($cart->fresh());
    }
}