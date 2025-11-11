@echo off
REM CertusChain Startup Script for Windows
REM This script helps you start the CertusChain platform

echo ========================================
echo    CertusChain Platform Startup
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker Compose is not installed.
    pause
    exit /b 1
)

REM Function to check .env files
if not exist "core-api\.env" (
    echo Warning: core-api\.env not found. Creating from example...
    copy "core-api\.env.example" "core-api\.env"
    echo Created core-api\.env - Please edit it with your configuration
)

if not exist "ai-service\.env" (
    echo Warning: ai-service\.env not found. Creating from example...
    copy "ai-service\.env.example" "ai-service\.env"
    echo Created ai-service\.env - Please edit it with your OpenAI API key
)

:menu
echo.
echo Select an option:
echo 1) Start all services (Docker Compose)
echo 2) Stop all services
echo 3) View service logs
echo 4) Restart services
echo 5) Check service status
echo 6) Run migrations
echo 7) Exit
echo.
set /p choice=Enter your choice [1-7]: 

if "%choice%"=="1" goto start
if "%choice%"=="2" goto stop
if "%choice%"=="3" goto logs
if "%choice%"=="4" goto restart
if "%choice%"=="5" goto status
if "%choice%"=="6" goto migrate
if "%choice%"=="7" goto end
echo Invalid choice. Please try again.
goto menu

:start
echo.
echo Starting services with Docker Compose...
docker-compose up -d
echo.
echo Waiting for database to be ready...
timeout /t 10 /nobreak >nul
echo.
echo Running database migrations...
docker-compose exec -T core-api npm run migration:run
echo.
echo Services started successfully!
echo.
echo Service URLs:
echo    - Core API: http://localhost:3000
echo    - API Docs: http://localhost:3000/api
echo    - AI Service: http://localhost:8001
echo    - Database: localhost:5432
echo.
echo View logs with: docker-compose logs -f
echo Stop services with: docker-compose down
pause
goto end

:stop
echo.
echo Stopping services...
docker-compose down
echo Services stopped
pause
goto end

:logs
echo.
echo Showing service logs (Ctrl+C to exit)...
docker-compose logs -f
goto end

:restart
echo.
echo Restarting services...
docker-compose restart
echo Services restarted
pause
goto end

:status
echo.
echo Service Status:
docker-compose ps
pause
goto end

:migrate
echo.
echo Running migrations...
docker-compose exec core-api npm run migration:run
echo Migrations completed
pause
goto end

:end
echo.
echo Goodbye!
exit /b 0
