<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        return response()->json(['message' => 'Register not implemented'], 501);
    }

    public function login(Request $request)
    {
        return response()->json(['message' => 'Login not implemented'], 501);
    }

    public function logout(Request $request)
    {
        return response()->json(['message' => 'Logout not implemented'], 501);
    }

    public function user(Request $request)
    {
        return response()->json(['message' => 'User endpoint not implemented'], 501);
    }
}

