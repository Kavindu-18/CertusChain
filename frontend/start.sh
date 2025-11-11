#!/bin/bash

# CertusChain Frontend Startup Script

echo "🚀 CertusChain Frontend"
echo "======================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "Creating from example..."
    cp .env.local .env.local 2>/dev/null || echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
    echo "✅ Created .env.local"
    echo "💡 Edit .env.local to configure your API URL"
    echo ""
fi

echo "🎯 Starting development server..."
echo "Frontend will be available at: http://localhost:3001"
echo ""

npm run dev
