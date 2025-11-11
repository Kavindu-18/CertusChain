#!/bin/bash

# CertusChain Startup Script
# This script helps you start the CertusChain platform

set -e

echo "🚀 CertusChain Platform Startup"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Function to check if .env files exist
check_env_files() {
    if [ ! -f "core-api/.env" ]; then
        echo "⚠️  core-api/.env not found. Creating from example..."
        cp core-api/.env.example core-api/.env
        echo "✅ Created core-api/.env - Please edit it with your configuration"
    fi

    if [ ! -f "ai-service/.env" ]; then
        echo "⚠️  ai-service/.env not found. Creating from example..."
        cp ai-service/.env.example ai-service/.env
        echo "✅ Created ai-service/.env - Please edit it with your OpenAI API key"
    fi
}

# Function to start services
start_services() {
    echo ""
    echo "📦 Starting services with Docker Compose..."
    docker-compose up -d
    
    echo ""
    echo "⏳ Waiting for database to be ready..."
    sleep 10
    
    echo ""
    echo "🔧 Running database migrations..."
    docker-compose exec -T core-api npm run migration:run || echo "⚠️  Migrations may have already run"
    
    echo ""
    echo "✅ Services started successfully!"
    echo ""
    echo "📍 Service URLs:"
    echo "   - Core API: http://localhost:3000"
    echo "   - API Docs: http://localhost:3000/api"
    echo "   - AI Service: http://localhost:8001"
    echo "   - Database: localhost:5432"
    echo ""
    echo "📚 View logs with: docker-compose logs -f"
    echo "🛑 Stop services with: docker-compose down"
}

# Function to show logs
show_logs() {
    echo ""
    echo "📋 Showing service logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

# Main menu
echo "Select an option:"
echo "1) Start all services (Docker Compose)"
echo "2) Stop all services"
echo "3) View service logs"
echo "4) Restart services"
echo "5) Check service status"
echo "6) Run migrations"
echo "7) Exit"
echo ""
read -p "Enter your choice [1-7]: " choice

case $choice in
    1)
        check_env_files
        start_services
        ;;
    2)
        echo "🛑 Stopping services..."
        docker-compose down
        echo "✅ Services stopped"
        ;;
    3)
        show_logs
        ;;
    4)
        echo "🔄 Restarting services..."
        docker-compose restart
        echo "✅ Services restarted"
        ;;
    5)
        echo "📊 Service Status:"
        docker-compose ps
        ;;
    6)
        echo "🔧 Running migrations..."
        docker-compose exec core-api npm run migration:run
        echo "✅ Migrations completed"
        ;;
    7)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac
