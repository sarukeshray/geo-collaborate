# backend/schemas.py

from pydantic import BaseModel
from datetime import datetime

# Base schema with common attributes
class ReportBase(BaseModel):
    latitude: float
    longitude: float

# Schema for creating a new report (what we expect in the request)
# We will get the image separately
class ReportCreate(ReportBase):
    pass

# Schema for reading a report (what we send back in the response)
class Report(ReportBase):
    id: int
    timestamp: datetime
    image_filename: str
    pothole_count: int
    average_confidence: float
    status: str

    class Config:
        # This allows Pydantic to work with ORM models
        from_attributes = True

# Add this to the end of backend/schemas.py

class Stats(BaseModel):
    total_reports: int
    total_potholes_detected: int