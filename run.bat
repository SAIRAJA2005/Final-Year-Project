@echo off
REM Brain Tumor Detection and Segmentation App - Production Startup
REM This script starts both backend and frontend services

setlocal enabledelayedexpansion

echo ===================================================
echo Brain Tumor Detection and Segmentation App
echo Production-Ready Setup
echo ===================================================
echo.

REM Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)

echo [OK] Python detected: 
python --version
echo.

REM Check Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Node.js is not installed or not in PATH
    echo Frontend will not start. Install from https://nodejs.org/
    echo.
) else (
    echo [OK] Node.js detected: 
    node --version
    echo.
)

REM Backend setup and start
echo [1/4] Setting up Backend Environment...
cd /d "Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning"

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [OK] Backend dependencies installed
echo.

echo [2/4] Starting FastAPI Backend (port 8000)...
echo [INFO] Backend will be available at: http://localhost:8000
echo [INFO] API documentation at: http://localhost:8000/docs
echo [INFO] Check health at: http://localhost:8000/health
echo.

REM Start backend in new terminal
start "Brain Tumor Detection - Backend (FastAPI)" cmd /k ^
    "call venv\Scripts\activate.bat && python -m uvicorn app:app --host 0.0.0.0 --port 8000 --log-level info"

echo [3/4] Waiting for backend to initialize (10 seconds)...
timeout /t 10 /nobreak
echo.

REM Frontend setup and start
cd ..
cd /d "Brain-health_frontend"

echo [4/4] Setting up Frontend Environment...
echo Installing frontend dependencies (this may take 1-2 minutes)...

if not exist "node_modules" (
    npm install
    if errorlevel 1 (
        echo [ERROR] Failed to install frontend dependencies
        echo Make sure Node.js 18+ is installed
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)

echo [OK] Frontend dependencies ready
echo.

echo Starting React Vite Frontend...
echo [INFO] Frontend will be available at: http://localhost:5173
echo.

REM Start frontend in new terminal
start "Brain Tumor Detection - Frontend (React)" cmd /k "npm run dev"

echo ===================================================
echo All services starting up...
echo.
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Frontend:     http://localhost:5173
echo.
echo Waiting 15 seconds for services to fully start...
timeout /t 15 /nobreak

echo.
echo ===================================================
echo Starting your browser...
timeout /t 2 /nobreak

REM Try to open the frontend in default browser
start http://localhost:5173 2>nul || (
    echo.
    echo [INFO] Please manually open your browser and navigate to:
    echo http://localhost:5173
)

echo.
echo ===================================================
echo Setup complete!
echo.
echo NEXT STEPS:
echo 1. Your browser should open to the application
echo 2. If not, visit: http://localhost:5173
echo 3. Click "Get Started" and select a model
echo 4. Upload an MRI image (PNG format)
echo 5. View segmentation results
echo.
echo To stop the services, close both terminal windows or press Ctrl+C
echo.
echo For production deployment, see: PRODUCTION_DEPLOYMENT.md
echo ===================================================
echo.
echo Backend and Frontend terminals are running in the background.
echo Keep this window open or services may stop.
pause
