#!/bin/bash

# MemeNem Frontend Deployment Script for Vercel
# This script prepares and deploys the frontend to Vercel free tier

echo "🚀 Deploying MemeNem Frontend to Vercel..."
echo

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please log in to Vercel..."
    vercel login
fi

# Set production environment
export NODE_ENV=production

# Build the application
echo "🏗️ Building application for production..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."

# For production deployment
if [ "$1" = "--prod" ]; then
    echo "📦 Deploying to production..."
    vercel --prod
else
    echo "🧪 Deploying to preview..."
    vercel
fi

echo
echo "✅ Deployment complete!"
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_API_URL: Your Render backend URL"
echo "   - NEXT_PUBLIC_SITE_URL: Your Vercel frontend URL"
echo "2. Configure custom domain if needed"
echo "3. Test the deployed application"
echo
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "📖 Docs: https://vercel.com/docs/environment-variables"