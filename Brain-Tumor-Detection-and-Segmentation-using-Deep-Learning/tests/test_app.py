import io
import numpy as np
import cv2
import pytest
from fastapi.testclient import TestClient

from app import app, IMG_SIZE


@pytest.fixture(scope="module")
def client():
    return TestClient(app)


def make_dummy_image():
    # create a random grayscale image of the correct size
    arr = np.random.randint(0, 256, (IMG_SIZE, IMG_SIZE), dtype=np.uint8)
    _, buf = cv2.imencode('.png', arr)
    return io.BytesIO(buf.tobytes())


def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("status") == "healthy"


def test_analyze_unet(client):
    img_file = make_dummy_image()
    files = {"file": ("test.png", img_file, "image/png")}
    data = {"model_type": "unet"}
    resp = client.post("/api/analyze", files=files, data=data)
    assert resp.status_code == 200
    out = resp.json()
    assert out.get("success")
    assert out.get("model") == "U-Net"


def test_analyze_mask_rcnn(client):
    img_file = make_dummy_image()
    files = {"file": ("test.png", img_file, "image/png")}
    data = {"model_type": "mask-rcnn"}
    resp = client.post("/api/analyze", files=files, data=data)
    assert resp.status_code == 200
    out = resp.json()
    assert out.get("success")
    assert out.get("model") == "Mask-RCNN"
    assert "boxes" in out.get("details", {})
