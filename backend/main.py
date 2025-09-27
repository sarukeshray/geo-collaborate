# backend/main.py

import uuid
import shutil
from typing import List
from fastapi import Depends, FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles

import crud
import models
import schemas
import ai_processor # Import our AI module
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="GeoCollaborate API",
    description="API for crowdsourcing and analyzing urban infrastructure issues.",
    version="0.1.0",
)

# Mount the 'uploads' directory to be able to serve the images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Welcome to the GeoCollaborate API!"}

@app.post("/reports/", response_model=schemas.Report)
def create_new_report(
    lat: float = Form(...),
    lon: float = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Save the uploaded file
    # Generate a unique filename to prevent overwrites
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"uploads/{unique_filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Process the image with the AI model
    analysis_result = ai_processor.analyze_image(file_path)
    if "error" in analysis_result:
        raise HTTPException(status_code=500, detail=analysis_result["error"])

    # 3. Create the database entry with the AI results
    report_data = schemas.ReportCreate(latitude=lat, longitude=lon)
    return crud.create_report(
        db=db, 
        report=report_data, 
        image_filename=unique_filename,
        analysis=analysis_result
    )
# Add this code block in backend/main.py (e.g., after the create_new_report function)

@app.get("/reports/stats", response_model=schemas.Stats)
def read_reports_stats(db: Session = Depends(get_db)):
    """
    Endpoint to get aggregated statistics about all reports.
    """
    return crud.get_reports_stats(db=db)

@app.get("/reports/", response_model=List[schemas.Report])
def read_reports(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reports = crud.get_reports(db, skip=skip, limit=limit)
    # Modify the image_filename to be a full URL
    base_url = "http://127.0.0.1:8000"
    for report in reports:
        report.image_filename = f"{base_url}/uploads/{report.image_filename}"
    return reports