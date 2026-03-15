# QUICK START GUIDE - Brain Health Project

## 🚀 Get Running in 5 Minutes

### Windows Users (FASTEST)
```
1. Open File Explorer
2. Navigate to: e:\FInal_Year_Project\Project_Version1
3. Double-click: run.bat
4. Wait 30-60 seconds
5. Browser opens to http://localhost:5173
6. You're done! Start uploading MRI scans
```

### Linux/macOS Users
```bash
cd /path/to/Brain-Health-Project
chmod +x run.sh
./run.sh
# Browser opens to http://localhost:5173
```

### Docker Users (Recommended for Production)
```bash
cd /path/to/Brain-Health-Project
docker-compose up -d
# Open http://localhost:3000 in your browser
```

---

## 🎯 First Test

1. **Wait for services to start** (check http://localhost:8000/health)
2. **Open http://localhost:5173** in your browser
3. **Click "Get Started"**
4. **Select**: "Simple Segmentation (U-Net)"
5. **Upload**: Any PNG image (try any grayscale medical image)
	 - You can also upload a NIfTI file (`.nii` or `.nii.gz`); the server will
		 automatically extract the central slice for analysis.
6. **Click**: "Run Segmentation"
7. **Wait**: 2-5 seconds for result
8. **Download**: Click "Download" to save

---

## ✅ What You Get

- ✅ Full-stack application (frontend + backend)
- ✅ Production-ready API with health checks
- ✅ Error handling and comprehensive logging
- ✅ Docker support for easy deployment
- ✅ Environment-based configuration (no hardcoded paths)
- ✅ Detailed documentation
- 📝 Mask R-CNN is currently a simulated detection mode; it will return a
	bounding box around any detected tumor but does not perform true object
	detection yet.

---

## 🔍 Verify Everything Works

### Check Backend Health
```bash
curl http://localhost:8000/health
# Should return: {"status": "healthy", "model_loaded": true, ...}
```

### Check Available Models
```bash
curl http://localhost:8000/api/models
```

### View API Documentation
Open: http://localhost:8000/docs

---

## 🆘 Something Not Working?

### Backend Won't Start?
```bash
# 1. Check Python version
python --version  # Should be 3.10+

# 2. Check if port 8000 is available
netstat -ano | findstr :8000

# 3. Try starting manually
cd Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning
python -m venv venv
venv\Scripts\activate  # Windows: or source venv/bin/activate on Linux
pip install -r requirements.txt
python app.py
```

### Frontend Won't Load?
```bash
# 1. Check Node version
node --version  # Should be 18+

# 2. Try manually
cd Brain-health_frontend
npm install
npm run dev
```

### Still Having Issues?
→ See [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md) for full troubleshooting guide

---

## 📱 Use the Application

1. **Home Page**: Click "Get Started"
2. **Model Selection**: Choose U-Net (Mask R-CNN coming soon)
3. **Upload**: Drag-and-drop MRI image or click to browse
4. **Analyze**: Click "Run Segmentation"
5. **Results**: View color-mapped segmentation
6. **Download**: Save result as PNG

**Tips:**
- First request takes 30-60s (model loading)
- Subsequent requests take 2-5s
- Use 120×120 pixel images for best performance
- Grayscale MRI images work best

---

## 📚 More Information

- **Detailed Guide**: [PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)
- **API Documentation**: http://localhost:8000/docs (when running)
- **Updated README**: [README_UPDATED.md](./README_UPDATED.md)

---

## 🎓 What's Inside

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: FastAPI + TensorFlow/Keras
- **Models**: U-Net (segmentation), Mask R-CNN (detection - coming soon)
- **Dataset**: BraTS brain tumor dataset
- **Deployment**: Docker + docker-compose

---

**Status**: ✅ PRODUCTION READY  
**Version**: 1.0.0

