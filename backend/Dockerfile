FROM php:8.3-fpm

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    curl \
    libzip-dev \
    zip \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libonig-dev \
    libxml2-dev \
    libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl gd

# Install Composer from the official Composer image
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory inside the container
WORKDIR /app

# Create a non-root user with the same UID and GID as the host user
ARG UID=1000
ARG GID=1000
RUN groupadd -g ${GID} appgroup && useradd -m -u ${UID} -g ${GID} appuser

# Set ownership of the working directory to the new user
RUN chown -R appuser:appgroup /app

# Copy application source code
COPY . .

# Install PHP dependencies via Composer
RUN composer install --no-dev --optimize-autoloader

# Copy and make the entrypoint script executable
COPY docker/entrypoint.sh /docker/entrypoint.sh
RUN chmod +x /docker/entrypoint.sh

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8000

# Set entrypoint and default command
ENTRYPOINT ["/docker/entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0"]
