# ──────────────────────────────────────────────────
# Meraki House — Laravel API (PHP 8.2 + Apache)
# Optimised for Render.com deployment
# ──────────────────────────────────────────────────

FROM php:8.2-apache

# ── System dependencies ──────────────────────────
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libsqlite3-dev \
    libpq-dev \
    sqlite3 \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        pdo \
        pdo_mysql \
        pdo_sqlite \
        pdo_pgsql \
        pgsql \
        mbstring \
        exif \
        pcntl \
        bcmath \
        gd \
        zip \
        xml \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# ── Apache configuration ─────────────────────────
# Enable mod_rewrite for Laravel's pretty URLs
RUN a2enmod rewrite headers

# Point Apache DocumentRoot to Laravel's public/ directory
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf

# Allow .htaccess overrides in all directories
RUN sed -ri -e 's/AllowOverride None/AllowOverride All/g' \
    /etc/apache2/apache2.conf

# ── Render: listen on $PORT (default 10000) ──────
# Render sets the PORT env var; Apache must bind to it
RUN sed -ri -e 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri -e 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf

# ── Install Composer ─────────────────────────────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Copy application code ────────────────────────
WORKDIR /var/www/html
COPY . .

# ── Install PHP dependencies (production) ────────
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

# ── File permissions ─────────────────────────────
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# ── Create SQLite database file if needed ────────
RUN mkdir -p database \
    && touch database/database.sqlite \
    && chown www-data:www-data database/database.sqlite

# ── Create storage symlink ───────────────────────
RUN php artisan storage:link 2>/dev/null || true

# ── Build optimisation caches ────────────────────
RUN php artisan config:clear \
    && php artisan route:clear \
    && php artisan view:clear

# ── Startup script ───────────────────────────────
# Run migrations + cache on every deploy, then start Apache
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE ${PORT}

ENTRYPOINT ["docker-entrypoint.sh"]
