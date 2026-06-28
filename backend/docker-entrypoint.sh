#!/bin/bash
set -e

# Default port for Render
export PORT="${PORT:-10000}"

echo "🏠 Meraki House API — Starting deployment..."

# Run database migrations
echo "📦 Running migrations..."
php artisan migrate --force 2>&1 || echo "⚠️  Migration warning (may be expected on first deploy)"

# Cache configuration for performance
echo "⚡ Building optimisation caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Ready! Starting Apache on port ${PORT}..."

# Start Apache in foreground
apache2-foreground
