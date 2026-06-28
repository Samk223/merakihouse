<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Ensure user is authenticated
        if (! $request->user()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Ensure user is an admin
        if (! $request->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized. Admin access required.',
            ], 403);
        }

        return $next($request);
    }
}
