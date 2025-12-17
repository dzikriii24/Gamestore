<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/games', [GameController::class, 'index']);
Route::get('/games/featured', [GameController::class, 'featured']);
Route::get('/games/trending', [GameController::class, 'trending']);
Route::get('/games/on-sale', [GameController::class, 'onSale']);
Route::get('/games/categories', [GameController::class, 'categories']);
Route::get('/games/{game}', [GameController::class, 'show']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/add/{game}', [CartController::class, 'addToCart']);
    Route::put('/cart/update/{cartItem}', [CartController::class, 'updateQuantity']);
    Route::delete('/cart/remove/{cartItem}', [CartController::class, 'removeFromCart']);
    Route::delete('/cart/clear', [CartController::class, 'clear']);
    
    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/toggle/{game}', [WishlistController::class, 'toggle']);
    Route::get('/wishlist/check/{game}', [WishlistController::class, 'check']);
    
    // Admin routes
    Route::middleware('admin')->group(function () {
        Route::post('/games', [GameController::class, 'store']);
        Route::put('/games/{game}', [GameController::class, 'update']);
        Route::delete('/games/{game}', [GameController::class, 'destroy']);
    });
});