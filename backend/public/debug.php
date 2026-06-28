<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Meraki House API Debug Page</h1>";

echo "<h2>PHP Info</h2>";
echo "PHP Version: " . PHP_VERSION . "<br>";

echo "<h2>Environment Variables</h2>";
$env_vars = [
    'APP_ENV',
    'APP_DEBUG',
    'APP_KEY',
    'DB_CONNECTION',
    'SESSION_DRIVER',
    'CACHE_STORE',
    'QUEUE_CONNECTION',
    'MAIL_MAILER',
    'BROADCAST_CONNECTION'
];
foreach ($env_vars as $var) {
    echo "<strong>$var:</strong> '" . getenv($var) . "' (via getenv) | '" . (isset($_ENV[$var]) ? $_ENV[$var] : 'not set in $_ENV') . "'<br>";
}

echo "<h2>Booting Laravel Kernel...</h2>";
try {
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    
    echo "<h3>Laravel Config Values</h3>";
    echo "session.driver: '" . config('session.driver') . "'<br>";
    echo "cache.default: '" . config('cache.default') . "'<br>";
    echo "queue.default: '" . config('queue.default') . "'<br>";
    echo "mail.default: '" . config('mail.default') . "'<br>";
    echo "database.default: '" . config('database.default') . "'<br>";
} catch (\Throwable $e) {
    echo "<h3>❌ Error during boot:</h3>";
    echo "<strong>Message:</strong> " . $e->getMessage() . "<br>";
    echo "<strong>File:</strong> " . $e->getFile() . ":" . $e->getLine() . "<br>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
