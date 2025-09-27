# backend/ai_processor.py

from ultralytics import YOLO
import os

# Load the YOLOv8 model. 
# 'yolov8n.pt' is the smallest and fastest version.
# The first time you run this, it will be downloaded automatically.
MODEL_PATH = 'yolov8n.pt'
model = YOLO(MODEL_PATH)

def analyze_image(image_path: str) -> dict:
    """
    Analyzes an image using the YOLOv8 model to detect objects.

    For the hackathon demo, we'll pretend a common object is a 'pothole'.
    YOLOv8 'coco' dataset class names can be found online. 
    Let's use class '9', which is 'traffic light', as a stand-in for potholes.
    This demonstrates the full AI pipeline is working.

    Args:
        image_path: The full path to the image file.

    Returns:
        A dictionary containing the analysis results.
    """
    if not os.path.exists(image_path):
        return {"error": "Image not found"}

    # Run inference on the image
    results = model(image_path, verbose=False) # verbose=False to keep the console clean

    # In a real app, you'd have a model fine-tuned for potholes.
    # For the demo, we are using a general model and re-purposing a class.
    POTHOLE_CLASS_ID = 9 # This is the class ID for 'traffic light' in the COCO dataset

    pothole_count = 0
    confidences = []

    # results is a list of Results objects
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
# This block is for testing only. It will only run if you execute this file directly.
if __name__ == "__main__":
    # Make sure you have an image named test_image.jpg in your backend folder
    test_result = analyze_image('test_image.jpg')
    print(f"Analysis Result: {test_result}")