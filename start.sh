#!/bin/bash
set -e

php artisan config:cache
php artisan route:cache
php artisan view:cache

php artisan migrate --force

if [ "$APP_ENV" = "production" ]; then
    php-fpm
else
    php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
fi
