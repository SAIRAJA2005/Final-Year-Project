# Command Reference - Brain Health Project

Quick command reference for running, testing, and deploying the Brain Health application.

## 🚀 QUICK START (Pick One)

### Windows - Fastest
```batch
run.bat
```
Then open http://localhost:5173

### Docker - Recommended for Production
```bash
docker-compose up -d
```
Then open http://localhost:3000

### Linux/macOS
```bash
chmod +x run.sh
./run.sh
```
Then open http://localhost:5173

---

## 🔧 Manual Setup (If Needed)

### Backend Setup
```bash
cd Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Start server
python app.py
# or use uvicorn directly:
# uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup (new terminal)
```bash
cd Brain-health_frontend

# Install dependencies
npm install
# or use bun (faster):
# bun install

# Start development server
npm run dev
# or
# bun run dev

# For production build:
# npm run build
# npm run preview
```

---

## 📡 API Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### Get Available Models
```bash
curl http://localhost:8000/api/models
```

### Analyze Image
```bash
# Windows
curl -X POST http://localhost:8000/api/analyze ^
  -F "file=@path\to\image.png" ^
  -F "model_type=unet"

# Linux/macOS
curl -X POST http://localhost:8000/api/analyze \
  -F "file=@path/to/image.png" \
  -F "model_type=unet"
```

### View API Documentation
```
http://localhost:8000/docs
```

---

## 🐳 Docker Commands

### Build Images
```bash
# Build backend
docker build -t brain-tumor-backend \
  Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning/

# Build frontend
docker build -t brain-tumor-frontend Brain-health_frontend/
```

### Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# Start with logs visible
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View logs for specific container
docker-compose logs backend --tail 50

# Restart services
docker-compose restart

# Check service status
docker-compose ps
```

### Run Individual Containers
```bash
# Backend only
docker run -p 8000:8000 \
  -e IMG_SIZE=120 \
  -e LOG_LEVEL=INFO \
  brain-tumor-backend

# Frontend only
docker run -p 3000:3000 \
  -e VITE_API_URL=http://localhost:8000 \
  brain-tumor-frontend
```

---

## 🧪 Testing

### Test Backend Health
```bash
# Should return healthy status
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","model_loaded":true,"weights_available":true}
```

### Test Image Upload
```bash
# Create a test image (requires ImageMagick or Python)
python -c "
from PIL import Image
import numpy as np
img = Image.fromarray(np.random.randint(0, 255, (120, 120), dtype=np.uint8))
img.save('test_image.png')
"

# Upload and analyze
curl -X POST http://localhost:8000/api/analyze \
  -F "file=@test_image.png" \
  -F "model_type=unet"
```

### Test Error Handling
```bash
# No file provided
curl -X POST http://localhost:8000/api/analyze

# Invalid model type
curl -X POST http://localhost:8000/api/analyze \
  -F "file=@test_image.png" \
  -F "model_type=invalid"

# Empty file
curl -X POST http://localhost:8000/api/analyze \
  -F "file=@empty_file" \
  -F "model_type=unet"
```

---

## 🔍 Debugging

### View Backend Logs
```bash
# With Docker
docker-compose logs -f backend

# With local server
# Server logs print to console

# Enable debug logging
LOG_LEVEL=DEBUG python app.py
```

### View Frontend Logs
```bash
# Browser console (F12 or Ctrl+Shift+I)
# Check Network tab for API calls

# Server logs (if using npm run build):
npm run dev
```

### Check Port Usage
```bash
# Windows
netstat -ano | findstr :8000
netstat -ano | findstr :5173

# Linux/macOS
lsof -i :8000
lsof -i :5173
```

### Kill Process on Port
```bash
# Windows
taskkill /PID <PID> /F

# Linux/macOS
kill -9 <PID>
```

---

## 📦 Dependency Management

### Update Python Dependencies
```bash
# Check for outdated packages
pip list --outdated

# Update all (use with caution!)
pip install --upgrade pip setuptools wheel

# Update specific package
pip install --upgrade tensorflow

# Reinstall from requirements
pip install -r requirements.txt --force-reinstall
```

### Update Node Dependencies
```bash
# Check for outdated packages
npm outdated

# Update all
npm update

# Update specific package
npm install express@latest

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

## 🚀 Deployment

### Cloud Deployment Preparation
```bash
# Build production-ready images
docker build -t brain-tumor-backend:1.0.0 \
  Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning/

docker build -t brain-tumor-frontend:1.0.0 \
  Brain-health_frontend/

# Tag for registry (example: Docker Hub)
docker tag brain-tumor-backend:1.0.0 \
  yourusername/brain-tumor-backend:1.0.0

docker tag brain-tumor-frontend:1.0.0 \
  yourusername/brain-tumor-frontend:1.0.0

# Push to registry
docker push yourusername/brain-tumor-backend:1.0.0
docker push yourusername/brain-tumor-frontend:1.0.0
```

### Kubernetes Deployment
```bash
# Apply deployment (requires deployment.yaml)
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods
kubectl get services

# View logs
kubectl logs -f deployment/brain-tumor-backend

# Scale replicas
kubectl scale deployment/brain-tumor-backend --replicas=3
```

---

## 🧹 Cleanup

### Remove Docker Containers/Images
```bash
# Stop containers
docker-compose down

# Remove images
docker rmi brain-tumor-backend brain-tumor-frontend

# Remove unused images
docker image prune -a

# Remove all containers
docker container prune
```

### Clean Python Cache
```bash
# Windows
rmdir /s __pycache__
del .pytest_cache

# Linux/macOS
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete
```

### Clean Node Cache
```bash
# Remove dependencies
rm -rf node_modules
rm -rf package-lock.json

# Clear npm cache
npm cache clean --force

# Clear build
rm -rf dist build
```

---

## 📊 Performance Commands

### Measure Inference Time
```bash
# Test with a single image
time curl -X POST http://localhost:8000/api/analyze \
  -F "file=@test_image.png" \
  -F "model_type=unet"
```

### Load Testing
```bash
# Install locust
pip install locust

# Create locustfile.py with test scenarios
# Run tests
locust -f locustfile.py --headless -u 100 -r 10 -t 1m
```

### Monitor Resource Usage
```bash
# Docker
docker stats

# System
# Windows Task Manager or:
wmic process list brief

# Linux
top
htop  # If installed

# macOS
Activity Monitor or:
top -l 1
```

---

## 🔐 Security

### Check Dependencies for Vulnerabilities
```bash
# Python
pip install safety
safety check

# Node.js
npm audit
npm audit fix
```

### Update to Secure Versions
```bash
# Python
pip install -r requirements.txt --upgrade

# Node.js
npm update
npm audit fix
```

---

## 📝 Useful Environment Variables

### Backend (.env file)
```env
IMG_SIZE=120
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000
WEIGHTS_DIR=../BraTS_small/weights
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:5173"]
MAX_UPLOAD_SIZE=52428800
REQUEST_TIMEOUT=60
```

### Frontend (.env file)
```env
VITE_API_URL=http://localhost:8000
VITE_APP_TITLE=Brain Health
VITE_ENABLE_MASK_RCNN=false
```

---

## 🎯 Complete Workflow

### Development Cycle
```bash
# 1. Start services
docker-compose up -d  # or run.bat

# 2. Wait for startup (30-60 seconds)
curl http://localhost:8000/health

# 3. Open application
# http://localhost:5173

# 4. Test functionality
# - Upload image
# - View results
# - Download output

# 5. Check logs if issues
docker-compose logs -f backend

# 6. Make code changes
# Code changes auto-reload in development mode

# 7. Stop when done
docker-compose down
```

### Production Deployment
```bash
# 1. Build images
docker build -t brain-tumor-backend Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning/
docker build -t brain-tumor-frontend Brain-health_frontend/

# 2. Tag versions
docker tag brain-tumor-backend:latest brain-tumor-backend:1.0.0
docker tag brain-tumor-frontend:latest brain-tumor-frontend:1.0.0

# 3. Push to registry
docker push brain-tumor-backend:1.0.0
docker push brain-tumor-frontend:1.0.0

# 4. Deploy with docker-compose or Kubernetes
docker-compose -f docker-compose.prod.yml up -d

# 5. Monitor
docker-compose logs -f
curl https://yourdomain.com/health
```

---

## 📞 Support Commands

### Get System Information
```bash
# Python version
python --version

# Node version
node --version
npm --version

# Docker version
docker --version
docker-compose --version

# OS Information
# Windows
wmic os get caption

# Linux/macOS
uname -a
```

### Show Configuration
```bash
# Show environment variables
echo %BACKEND_PORT%  # Windows
echo $BACKEND_PORT  # Linux/macOS

# Show active services
netstat -an | grep LISTEN  # Linux/macOS
netstat -ano | findstr LISTENING  # Windows

# Show Docker info
docker system info
docker-compose config
```

---

**Last Updated**: March 2026

