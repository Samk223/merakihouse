<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
foreach (App\Models\Category::all() as $c) {
    echo "ID: " . $c->id . " | Name: " . $c->name . " | Slug: " . $c->slug . "\n";
}
