# backend/models.py

from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base # Corrected Import

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    image_filename = Column(String, nullable=False)

    pothole_count = Column(Integer, default=0)
    average_confidence = Column(Float, default=0.0)

    status = Column(String, default="pending")