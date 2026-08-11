from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TrialLocationSchema(BaseModel):
    country: str
    city: Optional[str] = None
    facility_name: Optional[str] = None

    class Config:
        from_attributes = True

class TrialCriteriaSchema(BaseModel):
    criterion_type: str # inclusion, exclusion
    raw_text: str
    category: Optional[str] = "GENERAL"

    class Config:
        from_attributes = True

class TrialCreate(BaseModel):
    id: str # e.g. NCT04512345
    title: str
    official_title: Optional[str] = None
    condition: str
    brief_summary: Optional[str] = None
    detailed_description: Optional[str] = None
    phase: str
    study_type: Optional[str] = "Interventional"
    status: str = "Recruiting"
    min_age: int = 0
    max_age: int = 100
    gender_requirement: str = "All"
    intervention: Optional[str] = None
    sponsor: Optional[str] = None
    study_start: Optional[str] = None
    primary_completion: Optional[str] = None
    locations: Optional[List[TrialLocationSchema]] = []
    criteria: Optional[List[TrialCriteriaSchema]] = []

class TrialResponse(TrialCreate):
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class TrialFilterParams(BaseModel):
    condition: Optional[str] = None
    phase: Optional[str] = None
    status: Optional[str] = None
    country: Optional[str] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None
    gender: Optional[str] = None
    query: Optional[str] = None
