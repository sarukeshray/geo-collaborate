# backend/crud.py

from sqlalchemy.orm import Session
from sqlalchemy import func
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

def get_reports_stats(db: Session):
    """
    Calculates statistics from the reports in the database.
    """
    total_reports = db.query(models.Report).count()
    total_potholes = db.query(func.sum(models.Report.pothole_count)).scalar() or 0

    # You could expand this to count by status, etc.
    # For now, these two stats are great for a dashboard.

    return {"total_reports": total_reports, "total_potholes_detected": total_potholes}
