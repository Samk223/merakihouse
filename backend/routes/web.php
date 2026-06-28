<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'Meraki House API',
        'timestamp' => now()->toIso8601String()
    ]);
});
