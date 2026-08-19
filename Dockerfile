# syntax=docker/dockerfile:1

FROM php:8.5-fpm-bookworm AS php-base

RUN apt-get update && apt-get install -y --no-install-recommends \
        libicu-dev \
        libzip-dev \
    && docker-php-ext-install \
        intl \
        pcntl \
        pdo_mysql \
        zip \
    && rm -rf /var/lib/apt/lists/*

COPY docker/php/uploads.ini /usr/local/etc/php/conf.d/uploads.ini

WORKDIR /var/www

FROM php-base AS composer-base

RUN apt-get update && apt-get install -y --no-install-recommends unzip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

FROM composer-base AS development

CMD ["php-fpm"]

FROM composer-base AS vendor

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --no-scripts \
    --optimize-autoloader \
    --prefer-dist

COPY . .
RUN composer dump-autoload \
    --classmap-authoritative \
    --no-dev \
    --no-interaction

FROM node:24-alpine AS assets

WORKDIR /app

ARG VITE_APP_NAME=Laravel
ENV VITE_APP_NAME=${VITE_APP_NAME}

COPY package.json package-lock.json ./
RUN npm ci --no-audit

COPY . .
COPY --from=vendor /var/www/vendor ./vendor
RUN npm run build

FROM php-base AS app

RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY --chown=www-data:www-data . .
COPY --from=vendor --chown=www-data:www-data /var/www/vendor ./vendor
COPY --from=assets --chown=www-data:www-data /app/public/build ./public/build
COPY docker/php/production.ini /usr/local/etc/php/conf.d/production.ini
COPY docker/php/start-production.sh /usr/local/bin/start-production

RUN mkdir -p \
        bootstrap/cache \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
    && ln -s ../storage/app/public public/storage \
    && chown -R www-data:www-data bootstrap/cache storage \
    && cp -a public /usr/local/share/app-public \
    && cp -a public/build /usr/local/share/app-build \
    && rm -rf /usr/local/share/app-public/build \
    && chmod +x /usr/local/bin/start-production

USER www-data

CMD ["php-fpm"]
