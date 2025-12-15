# Gunakan image PHP resmi dengan Apache
FROM php:8.2-apache

# Install dependency sistem yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl

# Bersihkan cache apt untuk mengurangi ukuran image
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install ekstensi PHP yang dibutuhkan Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Aktifkan mod_rewrite Apache (Penting untuk URL Laravel)
RUN a2enmod rewrite

# Atur Document Root ke folder /public (Standar Laravel)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# Install Composer dari image resmi
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy file composer dulu (agar layer caching Docker optimal)
COPY composer.json composer.lock ./

# Install dependency PHP (tanpa dev dependencies untuk production)
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy seluruh source code project ke dalam container
COPY . .

# Set permission folder storage dan cache agar bisa ditulis oleh Apache
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Konfigurasi Port khusus Railway
# Railway menyuntikkan variabel $PORT. Kita ubah config Apache agar listen di port tersebut.
RUN sed -i 's/80/${PORT}/g' /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Perintah default saat container jalan
# Kita gunakan shell form agar variabel $PORT terbaca saat runtime
CMD sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf && docker-php-entrypoint apache2-foreground