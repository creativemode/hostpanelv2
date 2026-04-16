# HostPanel Deployment Guide

This guide will help you install HostPanel on a fresh Ubuntu 22.04/24.04 VPS.

## Prerequisites
- A VPS with at least 1GB RAM and 1 CPU.
- A registered domain pointed to your VPS IP address.
- Ubuntu 22.04 or newer.

## Step 1: Automated Setup
Run the included setup script to install Node.js, SQLite, and necessary system dependencies.

```bash
# Upload HostPanel to your VPS
cd hostpanel
chmod +x setup.sh
sudo ./setup.sh
```

## Step 2: Build the Application
Install dependencies and build the frontend assets.

```bash
npm install
npm run build
```

## Step 3: Configure Environment
Create a `.env` file based on `.env.example`.

```bash
cp .env.example .env
# Edit .env and set a random JWT_SECRET
nano .env
```

## Step 4: Run with PM2
To keep the server running in the background, use PM2.

```bash
sudo npm install -g pm2
NODE_ENV=production pm2 start server.ts --interpreter tsx --name hostpanel
pm2 save
pm2 startup
```

## Step 5: (Optional) Nginx Proxy
If you want to access the panel via `panel.yourdomain.com`, set up an Nginx reverse proxy pointing to port 3000.

```nginx
server {
    server_name panel.yourdomain.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Default Credentials
- **Login:** `admin@hostpanel.local`
- **Password:** `admin123`
*Ensure you change these immediately after logging in.*
