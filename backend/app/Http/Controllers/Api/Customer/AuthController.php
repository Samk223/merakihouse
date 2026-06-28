<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\LoginRequest;
use App\Http\Requests\Api\Customer\RegisterRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register a new user and return an API token.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                ],
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 201);
    }

    /**
     * Authenticate user and return an API token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'User logged in successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                ],
                'token' => $token,
                'token_type' => 'Bearer',
            ]
        ], 200);
    }

    /**
     * Revoke the user's current API token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ], 200);
    }

    /**
     * Return the authenticated user's profile.
     */
    public function profile(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Profile retrieved successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                ]
            ]
        ], 200);
    }

    /**
     * Update the authenticated user's profile details.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user->update([
            'name' => $request->input('name'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                ]
            ]
        ], 200);
    }
}
