<?php

use App\Http\Controllers\Api\Customer\AddressController;
use App\Http\Controllers\Api\Customer\AuthController;
use App\Http\Controllers\Api\Customer\CheckoutController;
use App\Http\Controllers\Api\Customer\CartController;
use App\Http\Controllers\Api\Customer\OrderController;
use App\Http\Controllers\Api\Customer\ProductController;
use App\Http\Controllers\Api\Customer\ReviewController;
use App\Http\Controllers\Api\Customer\WishlistController;
use App\Http\Controllers\Api\Customer\SupportTicketController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\CategoryController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\SupportTicketController as AdminSupportTicketController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/products/{product}/reviews', [ReviewController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category:slug}', [CategoryController::class, 'show']);

// Protected routes (Sanctum) - these are the protected routes using sanctum which strictly check tokens :)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::patch('/profile', [AuthController::class, 'updateProfile']);

    // Wishlist routes
    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist', [WishlistController::class, 'store']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

    // Cart routes
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::patch('/cart/{cartItem}', [CartController::class, 'update']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy']);

    // Address routes
    Route::get('/addresses', [AddressController::class, 'index']);
    Route::post('/addresses', [AddressController::class, 'store']);
    Route::patch('/addresses/{address}', [AddressController::class, 'update']);
    Route::delete('/addresses/{address}', [AddressController::class, 'destroy']);
    Route::patch('/addresses/{address}/default', [AddressController::class, 'setDefault']);

    // Checkout routes
    Route::post('/checkout', [CheckoutController::class, 'store']);

    // Order history routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);

    // Review routes
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::patch('/reviews/{review}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy']);

    // Support Ticket routes
    Route::get('/support/tickets', [SupportTicketController::class, 'index']);
    Route::post('/support/tickets', [SupportTicketController::class, 'store']);
    Route::get('/support/tickets/{ticket}', [SupportTicketController::class, 'show']);
    Route::post('/support/tickets/{ticket}/reply', [SupportTicketController::class, 'reply']);
});

// Admin routes
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::apiResource('categories', CategoryController::class);
        Route::post('/products/upload', [AdminProductController::class, 'uploadMedia']);
        Route::apiResource('products', AdminProductController::class);
        Route::get('/orders', [AdminOrderController::class, 'index']);
        Route::get('/orders/{order}', [AdminOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [AdminOrderController::class, 'updateStatus']);
        Route::get('/orders/{order}/history', [AdminOrderController::class, 'history']);
        Route::get('/support/tickets', [AdminSupportTicketController::class, 'index']);
        Route::get('/support/tickets/{ticket}', [AdminSupportTicketController::class, 'show']);
        Route::patch('/support/tickets/{ticket}/assign', [AdminSupportTicketController::class, 'assign']);
        Route::patch('/support/tickets/{ticket}/status', [AdminSupportTicketController::class, 'updateStatus']);
        Route::post('/support/tickets/{ticket}/reply', [AdminSupportTicketController::class, 'reply']);
    });
