from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class ClinicalTrial(Base):
    __tablename__ = "clinical_trials"

    id = Column(String, primary_key=True, index=True) # e.g. NCT04512345
    title = Column(String, nullable=False)
    official_title = Column(Text, nullable=True)
    condition = Column(String, index=True, nullable=False)
    brief_summary = Column(Text, nullable=True)
    detailed_description = Column(Text, nullable=True)
    phase = Column(String, nullable=False) # Phase 1, Phase 2, Phase 3, Phase 4, N/A
    study_type = Column(String, default="Interventional")
    status = Column(String, index=True, nullable=False, default="Recruiting") # Recruiting, Active, Completed
    min_age = Column(Integer, default=0)
    max_age = Column(Integer, default=100)
    gender_requirement = Column(String, default="All") # Male, Female, All
    intervention = Column(String, nullable=True)
    sponsor = Column(String, nullable=True)
    study_start = Column(String, nullable=True)
    primary_completion = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    locations = relationship("TrialLocation", back_populates="trial", cascade="all, delete-orphan")
    criteria = relationship("TrialCriteria", back_populates="trial", cascade="all, delete-orphan")
    match_results = relationship("MatchResult", back_populates="trial", cascade="all, delete-orphan")

class TrialLocation(Base):
    __tablename__ = "trial_locations"

    id = Column(Integer, primary_key=True, index=True)
    trial_id = Column(String, ForeignKey("clinical_trials.id"), nullable=False)
    country = Column(String, nullable=False)
    city = Column(String, nullable=True)
    facility_name = Column(String, nullable=True)

    trial = relationship("ClinicalTrial", back_populates="locations")

class TrialCriteria(Base):
    __tablename__ = "trial_criteria"

    id = Column(Integer, primary_key=True, index=True)
    trial_id = Column(String, ForeignKey("clinical_trials.id"), nullable=False)
    criterion_type = Column(String, nullable=False) # 'inclusion' or 'exclusion'
    raw_text = Column(Text, nullable=False)
    category = Column(String, nullable=True, default="GENERAL") # AGE, BIOMARKER, PRIOR_TREATMENT, STAGE, COMORBIDITY

    trial = relationship("ClinicalTrial", back_populates="criteria")
