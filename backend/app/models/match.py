from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class MatchResult(Base):
    __tablename__ = "match_results"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    trial_id = Column(String, ForeignKey("clinical_trials.id"), nullable=False)
    
    total_score = Column(Float, nullable=False)
    rule_score = Column(Float, nullable=False)
    semantic_score = Column(Float, nullable=False)
    condition_score = Column(Float, nullable=False)
    location_score = Column(Float, nullable=False)
    status_score = Column(Float, nullable=False)
    
    eligibility_status = Column(String, nullable=False) # LIKELY_MATCH, POSSIBLE_MATCH, NEEDS_REVIEW, UNLIKELY_MATCH
    breakdown_json = Column(JSON, nullable=False) # Detailed factor checks
    calculated_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("Patient", back_populates="match_results")
    trial = relationship("ClinicalTrial", back_populates="match_results")
