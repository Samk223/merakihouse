#!/bin/bash
set -e

# Default port for Render
export PORT="${PORT:-10000}"

echo "🏠 Meraki House API — Starting deployment..."

# Copy secret .env file from Render's mount path to Laravel's root
if [ -f /etc/secrets/.env ]; then
    echo "🔑 Found secret .env file, copying to app root..."
    cp /etc/secrets/.env /var/www/html/.env
    chown www-data:www-data /var/www/html/.env
    chmod 644 /var/www/html/.env
fi

# Clear any stale caches before rebuilding
echo "🧹 Clearing stale caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear 2>/dev/null || true

# Run database migrations
echo "📦 Running migrations..."
php artisan migrate --force 2>&1 || echo "⚠️  Migration warning (may be expected on first deploy)"

# Cache configuration for performance
echo "⚡ Building optimisation caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔍 Live Config Dump (Sanitised):"
php artisan tinker --execute="echo 'DB_CONNECTION: ' . config('database.default') . PHP_EOL; echo 'SESSION_DRIVER: ' . config('session.driver') . PHP_EOL; echo 'CACHE_STORE: ' . config('cache.default') . PHP_EOL; echo 'QUEUE_CONNECTION: ' . config('queue.default') . PHP_EOL; echo 'MAIL_MAILER: ' . config('mail.default') . PHP_EOL; echo 'BROADCAST_CONNECTION: ' . config('broadcasting.default') . PHP_EOL;"

# Create storage symlink
php artisan storage:link 2>/dev/null || true

echo "✅ Ready! Starting Apache on port ${PORT}..."

# Start Apache in foreground
apache2-foreground
