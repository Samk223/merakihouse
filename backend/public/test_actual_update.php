<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$admin = App\Models\User::where('role', 'admin')->first();
if (!$admin) {
    echo "No admin user found\n";
    exit;
}

// Perform a PUT request on product ID 37 (Lavender Clay Soap)
$request = Illuminate\Http\Request::create('/api/admin/products/37', 'PUT', [
    'category_id' => 1, 
    'name' => 'Lavender Clay Soap',
    'slug' => 'lavender-clay-soap',
    'sku' => 'MH-PRD-000001',
    'description' => 'Infused with lavender extracts and the soft clays to form the long lasting clay soap.',
    'short_description' => 'Organic, cold pressed and lavender beads',
    'brand' => 'Meraki House',
    'price' => 299.00,
    'discount_price' => null,
    'stock' => 500,
    'gst_percentage' => 18,
    'low_stock_threshold' => 5,
    'weight' => 0.00,
    'dimensions' => '10x5x5',
    'meta_title' => 'lavender clay soaps',
    'meta_description' => 'Clay soaps now available in lavender extr',
    'is_active' => true,
    'is_featured' => true,
    'is_best_seller' => false,
    'is_new_arrival' => true,
    'product_type' => 'simple',
]);

$request->setUserResolver(function () use ($admin) {
    return $admin;
});

Illuminate\Support\Facades\Auth::login($admin);

try {
    $response = $kernel->handle($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Content: " . $response->getContent() . "\n";
} catch (Exception $e) {
    echo "EXCEPTION: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
