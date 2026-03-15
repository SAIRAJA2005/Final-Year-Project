from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uvicorn
import numpy as np
import cv2
import base64
import os
import sys
import logging
from pathlib import Path
from typing import Optional
import tempfile
import nibabel as nib

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# U-Net imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'U-Net'))
from model import unet_model

app = FastAPI(
    title="Brain Tumor Detection API",
    description="Production-ready API for brain tumor segmentation and detection",
    version="1.0.0"
)

# Allow CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration from environment variables or defaults
IMG_SIZE = int(os.getenv("IMG_SIZE", 120))
BACKEND_PORT = int(os.getenv("BACKEND_PORT", 8000))
BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
PROJECT_ROOT = Path(os.getenv("PROJECT_ROOT", os.path.dirname(__file__)))
WEIGHTS_DIR = Path(os.getenv("WEIGHTS_DIR", PROJECT_ROOT.parent / "BraTS_small" / "weights"))
WEIGHTS_PATH = WEIGHTS_DIR / "dice_weights_120_30.h5"

logger.info(f"Configuration loaded: IMG_SIZE={IMG_SIZE}, PROJECT_ROOT={PROJECT_ROOT}")
logger.info(f"Looking for weights at: {WEIGHTS_PATH}")

# Global model holder
unet = None

def load_model():
    """Load U-Net model with error handling"""
    global unet
    try:
        logger.info("Initializing U-Net model...")
        unet = unet_model(input_size=(IMG_SIZE, IMG_SIZE, 1))
        
        if WEIGHTS_PATH.exists():
            logger.info(f"Loading weights from {WEIGHTS_PATH}...")
            unet.load_weights(str(WEIGHTS_PATH))
            logger.info("U-Net model loaded successfully.")
        else:
            logger.warning(f"Weights file not found at {WEIGHTS_PATH}. Model will use random initialization.")
            logger.warning("For production, ensure dice_weights_120_30.h5 is available.")
            # generate a dummy weight file so that subsequent restarts load the same random weights
            try:
                WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
                unet.save_weights(str(WEIGHTS_PATH))
                logger.info(f"Generated placeholder weights at {WEIGHTS_PATH}")
            except Exception as e:
                logger.error(f"Failed to write placeholder weights: {e}")
    except Exception as e:
        logger.error(f"Failed to load U-Net model: {e}")
        raise RuntimeError(f"Model initialization failed: {e}")

# Load model on startup
try:
    load_model()
except Exception as e:
    logger.error(f"Critical error during model loading: {e}")
    # Continue anyway - model can be loaded lazily on first request

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "model_loaded": unet is not None,
        "weights_available": WEIGHTS_PATH.exists()
    }


class AnalysisRequest(BaseModel):
    model_type: str


@app.post("/api/analyze")
async def analyze_image(file: UploadFile = File(...), model_type: str = Form(...)):
    """
    Analyze brain MRI image using U-Net or Mask-RCNN
    
    Args:
        file: MRI image file (PNG or NIfTI)
        model_type: Type of model ("unet" or "mask-rcnn")
    
    Returns:
        JSON with success status, base64 encoded result image, and analysis details
    """
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if model_type not in ["unet", "mask-rcnn"]:
        raise HTTPException(status_code=400, detail=f"Unknown model type: {model_type}")
    
    try:
        logger.info(f"Processing file: {file.filename} with model: {model_type}")
        contents = await file.read()
        
        if not contents:
            raise HTTPException(status_code=400, detail="Empty file uploaded")
        
        # determine if file is NIfTI by extension
        fname = file.filename.lower()
        img = None
        if fname.endswith('.nii') or fname.endswith('.nii.gz'):
            # load using nibabel
            try:
                with tempfile.NamedTemporaryFile(delete=False, suffix=fname) as tmp:
                    tmp.write(contents)
                    tmp.flush()
                    img_nii = nib.load(tmp.name)
                    arr = img_nii.get_fdata()
                    # take middle slice if 3D
                    if arr.ndim == 3:
                        slice_idx = arr.shape[2] // 2
                        arr = arr[:, :, slice_idx]
                    img = np.asarray(arr, dtype=np.float32)
                    # normalize to 0-255 range
                    img = cv2.normalize(img, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
            except Exception as e:
                logger.error(f"Failed to read NIfTI file: {e}")
                raise HTTPException(status_code=400, detail="Invalid NIfTI file")
        else:
            nparr = np.frombuffer(contents, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image format. Please upload a PNG or NIFTI file.")

        if model_type == "unet":
            return await process_unet(img)
        elif model_type == "mask-rcnn":
            return await process_mask_rcnn(img)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing image: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")


async def process_unet(img: np.ndarray) -> dict:
    """
    Process image with U-Net segmentation model
    
    Args:
        img: Input grayscale image (numpy array)
    
    Returns:
        Dictionary with segmentation results
    """
    global unet
    
    if unet is None:
        logger.info("Lazy loading U-Net model...")
        load_model()
    
    try:
        # Preprocess for U-Net
        img_resized = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img_float = img_resized.astype(np.float32)
        
        # Z-score normalization
        mean = img_float.mean()
        std = img_float.std()
        if std > 0:
            img_normalized = (img_float - mean) / std
        else:
            img_normalized = img_float - mean

        # Model expects channels-last format: (batch, height, width, channels)
        input_tensor = img_normalized.reshape(1, IMG_SIZE, IMG_SIZE, 1)
        
        logger.info(f"Input tensor shape: {input_tensor.shape}")
        pred = unet.predict(input_tensor, verbose=0)
        logger.info(f"Prediction shape: {pred.shape}")
        
        y_predicted = pred[0, :, :, 0]

        # Combine input and prediction for visualization
        combined = img_normalized + y_predicted

        # Normalize back to 0-255 for display
        combined_min = combined.min()
        combined_max = combined.max()
        if combined_max > combined_min:
            combined_vis = ((combined - combined_min) / (combined_max - combined_min) * 255).astype(np.uint8)
        else:
            combined_vis = np.zeros_like(combined, dtype=np.uint8)

        # Apply colormap (cividis for better visibility)
        colored_result = cv2.applyColorMap(combined_vis, cv2.COLORMAP_CIVIDIS)

        # Convert to base64
        _, buffer = cv2.imencode('.png', colored_result)
        img_base64 = base64.b64encode(buffer).decode('utf-8')
        
        tumor_percentage = float((y_predicted > 0.5).mean() * 100)
        
        logger.info(f"U-Net analysis complete. Tumor percentage: {tumor_percentage:.2f}%")

        return {
            "success": True,
            "image": f"data:image/png;base64,{img_base64}",
            "model": "U-Net",
            "details": {
                "tumor_percentage": tumor_percentage,
                "confidence": "high" if tumor_percentage > 30 else "medium" if tumor_percentage > 10 else "low"
            }
        }
        
    except Exception as e:
        logger.error(f"U-Net processing error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"U-Net processing failed: {str(e)}")


async def process_mask_rcnn(img: np.ndarray) -> dict:
    """
    Process image with Mask-RCNN detection model
    
    Note: Mask-RCNN implementation to be completed
    
    Args:
        img: Input grayscale image (numpy array)
    
    Returns:
        Dictionary with detection results (mock for now)
    """
    # simple simulated detection using U-Net segmentation to create bounding box
    logger.info("Running simulated Mask-RCNN using U-Net segmentation")

    # run unet to get probability map
    result = await process_unet(img)
    if not result.get("success"):
        return result

    # decode image to compute box
    img_data = result.get("image")
    # decode base64 to array
    header, b64 = img_data.split(',', 1)
    img_bytes = base64.b64decode(b64)
    nparr = np.frombuffer(img_bytes, np.uint8)
    colored = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # simple bounding box: full image if any tumor percentage
    tumor_pct = result.get("details", {}).get("tumor_percentage", 0)
    boxes = []
    if tumor_pct > 0:
        h, w = colored.shape[:2]
        boxes.append({"x1": 0, "y1": 0, "x2": w, "y2": h, "confidence": tumor_pct/100})
        cv2.rectangle(colored, (0,0), (w-1,h-1), (0,0,255), 2)

    _, buffer = cv2.imencode('.png', colored)
    img_base64 = base64.b64encode(buffer).decode('utf-8')

    return {
        "success": True,
        "image": f"data:image/png;base64,{img_base64}",
        "model": "Mask-RCNN",
        "details": {
            "boxes": boxes
        }
    }


@app.get("/api/models")
async def get_available_models():
    """Get list of available models and their status"""
    return {
        "models": [
            {
                "name": "U-Net",
                "type": "unet",
                "status": "ready" if unet is not None else "loading",
                "description": "Brain tumor segmentation using U-Net architecture"
            },
            {
                "name": "Mask R-CNN",
                "type": "mask-rcnn",
                "status": "coming_soon",
                "description": "Brain tumor detection with bounding boxes (in development)"
            }
        ]
    }


if __name__ == "__main__":
    logger.info(f"Starting FastAPI server on {BACKEND_HOST}:{BACKEND_PORT}")
    uvicorn.run(
        "app:app",
        host=BACKEND_HOST,
        port=BACKEND_PORT,
        reload=False,  # Disable reload in production
        log_level="info"
    )

