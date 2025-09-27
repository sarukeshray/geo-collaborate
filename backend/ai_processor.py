# backend/ai_processor.py

from ultralytics import YOLO
import os

# --- CHANGE #1: Point to our new custom model ---
MODEL_PATH = 'best.pt' 
model = YOLO(MODEL_PATH)

def analyze_image(image_path: str) -> dict:
    """
    Analyzes an image using our CUSTOM-TRAINED YOLOv8 model.
    """
    if not os.path.exists(image_path):
        return {"error": "Image not found"}

    results = model(image_path, verbose=False)

    # --- CHANGE #2: 'pothole' is class ID 0 in our dataset ---
    POTHOLE_CLASS_ID = 0 

    pothole_count = 0
    confidences = []

    for result in results:
        for box in result.boxes:
            if int(box.cls) == POTHOLE_CLASS_ID:
                pothole_count += 1
                confidences.append(float(box.conf))

    average_confidence = sum(confidences) / len(confidences) if confidences else 0.0

    analysis = {
        "pothole_count": pothole_count,
        "average_confidence": round(average_confidence, 4)
    }

    return analysis