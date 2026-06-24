#!/bin/bash
echo "🚀 Starting deployment..."
cd /var/www/Trakjobs-frontend
git fetch origin
git reset --hard origin/master
echo "📦 Installing dependencies..."
npm install
echo "🏗️ Building..."
npm run build
chown -R www-data:www-data /var/www/Trakjobs-frontend
systemctl reload nginx
echo "✅ Deployment completed!"
