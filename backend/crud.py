# backend/crud.py

from sqlalchemy.orm import Session
import models
import schemas

def get_reports(db: Session, skip: int = 0, limit: int = 100):
    """
    Fetches all reports with pagination.
    """
    return db.query(models.Report).offset(skip).limit(limit).all()

def create_report(db: Session, report: schemas.ReportCreate, image_filename: str, analysis: dict):
    """
    Creates a new report in the database, now including AI analysis data.
    """
    db_report = models.Report(
        latitude=report.latitude,
        longitude=report.longitude,
        image_filename=image_filename,
        pothole_count=analysis.get("pothole_count", 0),
        average_confidence=analysis.get("average_confidence", 0.0)
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report