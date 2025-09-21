#!/bin/bash

# MemeNem Frontend Setup Script
# This script sets up the MemeNem frontend for development

echo "🚀 Setting up MemeNem Frontend..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "🔧 Please edit .env.local with your backend URL"
else
    echo "✅ Environment file already exists"
fi

echo
echo "🎉 Setup complete!"
echo
echo "📋 Next steps:"
echo "1. Make sure MemeNem backend is running on http://localhost:8000"
echo "2. Edit .env.local if needed to match your backend URL"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Open http://localhost:3000 in your browser"
echo
echo "🚀 Happy meme generating!"