# Brain Health - Final Year Project

This project integrates a **React/Vite Frontend** with a **FastAPI Deep Learning Backend** (U-Net for brain tumor segmentation and Mask-RCNN for detection). It provides a full-stack, production-ready pipeline for analyzing MRI scans.

## Project Structure
- `Brain-health_frontend/` - Modern React application with Tailwind CSS and Framer Motion.
- `Brain-Tumor-Detection-and-Segmentation-using-Deep-Learning/` - Python deep learning models and the FastAPI backend (`app.py`).

## Quick Start (Windows)
We have provided an automated batch script to install dependencies and run both the frontend and backend servers.

1. Double-click the `run.bat` file in this directory.
2. The script will automatically open two terminal windows:
   - One for the **FastAPI Backend** (runs on port `8000`).
   - One for the **React Frontend** (runs on port `8080` or `5173`).
3. Open the frontend address in your browser (e.g. `http://localhost:8080`).

> **Note**: For the backend to work, ensure you have Python 3.8+ installed. For the frontend, ensure you have Node.js 18+ installed.

## Features
- **Upload MRI Scans**: Upload PNG or NIfTI MRI slices.
- **U-Net Segmentation**: Get detailed segmentations indicating tumor probability maps.
- **FastAPI Wrapper**: Connects raw deep learning model predictions reliably to the UI.

## Testing & Submission
To verify the application:
1. Start the project using `run.bat`.
2. Click "Get Started" and choose simple Segmentation.
3. Upload an MRI image slice (`.png`) from the dataset.
4. The system will contact the backend API (`http://localhost:8000/api/analyze`), process the image via U-Net, and return the color-mapped segmentation result directly to the Results page.
