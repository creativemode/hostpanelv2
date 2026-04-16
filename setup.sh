#!/bin/bash

# HostPanel System Setup Script
# Works on Ubuntu 22.04+

echo "🚀 Starting HostPanel Environment Setup..."

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install essential tools
sudo apt install -y curl git unzip build-essential sqlite3

# 3. Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install PHP (Multiple versions)
sudo apt install -y software-properties-common
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

echo "📦 Installing PHP 8.1, 8.2, 8.3..."
sudo apt install -y php8.1-fpm php8.1-mysql php8.1-xml php8.1-curl php8.1-mbstring php8.1-zip
sudo apt install -y php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip
sudo apt install -y php8.3-fpm php8.3-mysql php8.3-xml php8.3-curl php8.3-mbstring php8.3-zip

# 5. Install Nginx (Optional but recommended)
sudo apt install -y nginx

# 6. Setup Directory Permissions
sudo chown -R $USER:$USER /var/www
chmod 755 /var/www

echo "✅ Setup Complete!"
echo "You can now run 'npm install' and 'npm run dev' to start HostPanel."
