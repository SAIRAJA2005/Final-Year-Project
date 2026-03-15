#!/bin/bash

# Brain Tumor Detection and Segmentation App - Production Startup
# For Linux/macOS systems

set -e  # Exit on error

echo "=================================================="
echo "Brain Tumor Detection and Segmentation App"
echo "Production-Ready Setup"
echo "=================================================="
echo ""

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python 3 is not installed"
    echo "Please install Python 3.8+ from https://www.python.org/"
    exit 1
fi

echo "[OK] Python detected:"
python3 --version
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "[WARNING] Node.js is not installed"
    echo "Frontend will not start. Install from https://nodejs.org/"
    echo ""
else
    echo "[OK] Node.js detected:"
    node --version
    echo ""
fi

# Backend setup and start
echo "[1/4] Setting up Backend Environment..."
cd "Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning"

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
pip install -q -r requirements.txt

echo "[OK] Backend dependencies installed"
echo ""

echo "[2/4] Starting FastAPI Backend (port 8000)..."
echo "[INFO] Backend will be available at: http://localhost:8000"
echo "[INFO] API documentation at: http://localhost:8000/docs"
echo "[INFO] Check health at: http://localhost:8000/health"
echo ""

# Start backend in background
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --log-level info &
BACKEND_PID=$!

echo "[3/4] Waiting for backend to initialize (10 seconds)..."
sleep 10
echo ""

# Frontend setup and start
cd ..
cd "Brain-health_frontend"

echo "[4/4] Setting up Frontend Environment..."
echo "Installing frontend dependencies..."

if [ ! -d "node_modules" ]; then
    npm install
else
    echo "[OK] Dependencies already installed"
fi

echo ""
echo "Starting React Vite Frontend..."
echo "[INFO] Frontend will be available at: http://localhost:5173"
echo ""

# Start frontend in background
npm run dev &
FRONTEND_PID=$!

sleep 5

echo "=================================================="
echo "All services starting up..."
echo ""
echo "Backend API:  http://localhost:8000"
echo "API Docs:     http://localhost:8000/docs"
echo "Frontend:     http://localhost:5173"
echo ""
echo "=================================================="
echo ""
echo "To stop services, press Ctrl+C or run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Open browser if possible
if command -v xdg-open &> /dev/null; then
    sleep 3
    xdg-open "http://localhost:5173" 2>/dev/null &
elif command -v open &> /dev/null; then
    sleep 3
    open "http://localhost:5173" 2>/dev/null &
fi

# Wait for both processes
wait
