from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
from app.schemas.trial import TrialResponse
from app.schemas.patient import PatientResponse

class MatchRequest(BaseModel):
    patient_id: int
    top_k: Optional[int] = 10
    weight_eligibility: Optional[float] = 0.40
    weight_semantic: Optional[float] = 0.30
    weight_condition: Optional[float] = 0.15
    weight_location: Optional[float] = 0.10
    weight_status: Optional[float] = 0.05

class TrialMatchRequest(BaseModel):
    trial_id: str
    top_k: Optional[int] = 10
    weight_eligibility: Optional[float] = 0.40
    weight_semantic: Optional[float] = 0.30
    weight_condition: Optional[float] = 0.15
    weight_location: Optional[float] = 0.10
    weight_status: Optional[float] = 0.05

class MatchFactor(BaseModel):
    category: str # AGE, GENDER, CONDITION, STAGE, BIOMARKER, PRIOR_TREATMENT, EXCLUSION
    factor_name: str
    patient_value: str
    trial_requirement: str
    status: str # PASS, WARNING, FAIL, UNKNOWN
    details: str

class MatchResultResponse(BaseModel):
    trial_id: str
    trial: TrialResponse
    total_score: float
    eligibility_status: str # LIKELY_MATCH, POSSIBLE_MATCH, NEEDS_REVIEW, UNLIKELY_MATCH
    rule_score: float
    semantic_score: float
    condition_score: float
    location_score: float
    status_score: float
    matching_factors: List[MatchFactor]
    potential_issues: List[MatchFactor]
    calculated_at: datetime

    class Config:
        from_attributes = True

class PatientMatchResultResponse(BaseModel):
    patient_id: int
    patient: PatientResponse
    total_score: float
    eligibility_status: str # LIKELY_MATCH, POSSIBLE_MATCH, NEEDS_REVIEW, UNLIKELY_MATCH
    rule_score: float
    semantic_score: float
    condition_score: float
    location_score: float
    status_score: float
    matching_factors: List[MatchFactor]
    potential_issues: List[MatchFactor]
    calculated_at: datetime

    class Config:
        from_attributes = True

class RAGQueryInput(BaseModel):
    trial_id: str
    question: str

class RAGQueryResponse(BaseModel):
    trial_id: str
    question: str
    answer: str
    sources: List[str]
    disclaimer: str
