<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
foreach (App\Models\Product::all() as $p) {
    echo "ID: " . $p->id . " | Name: " . $p->name . " | Slug: " . $p->slug . "\n";
}
