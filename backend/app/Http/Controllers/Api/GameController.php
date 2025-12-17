<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameResource;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index(Request $request)
    {
        $query = Game::query();

        // Filter by category
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by discount
        if ($request->boolean('on_sale')) {
            $query->onSale();
        }

        // Sorting
        $sort = $request->get('sort', 'latest');
        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'rating':
                $query->orderBy('rating', 'desc');
                break;
            case 'discount':
                $query->orderBy('discount', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $games = $query->paginate(12);

        return GameResource::collection($games);
    }

    public function show(Game $game)
    {
        return new GameResource($game);
    }

    public function featured()
    {
        $games = Game::featured()->limit(8)->get();
        return GameResource::collection($games);
    }

    public function trending()
    {
        $games = Game::trending()->limit(8)->get();
        return GameResource::collection($games);
    }

    public function onSale()
    {
        $games = Game::onSale()->limit(8)->get();
        return GameResource::collection($games);
    }

    public function categories()
    {
        $categories = Game::distinct('category')->pluck('category');
        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'discount' => 'numeric|min:0|max:100',
            'rating' => 'integer|min:0|max:5',
            'category' => 'required|string',
            'platform' => 'string',
            'developer' => 'required|string',
            'publisher' => 'required|string',
            'release_date' => 'required|date',
            'image_url' => 'required|url',
            'screenshots' => 'array',
            'video_url' => 'nullable|url',
            'tags' => 'array',
            'age_rating' => 'integer|min:0|max:21',
        ]);

        $game = Game::create($validated);

        return new GameResource($game);
    }

    public function update(Request $request, Game $game)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'price' => 'numeric|min:0',
            'discount' => 'numeric|min:0|max:100',
            'rating' => 'integer|min:0|max:5',
            'category' => 'string',
            'image_url' => 'url',
        ]);

        $game->update($validated);

        return new GameResource($game);
    }

    public function destroy(Game $game)
    {
        $game->delete();
        return response()->json(['message' => 'Game deleted successfully']);
    }
}