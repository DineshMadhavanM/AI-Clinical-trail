from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class BiomarkerSchema(BaseModel):
    marker_name: str
    status: str # Positive, Negative, Mutated, Unknown

    class Config:
        from_attributes = True

class TreatmentSchema(BaseModel):
    treatment_name: str
    treatment_type: Optional[str] = "prior" # prior, current

    class Config:
        from_attributes = True

class ComorbiditySchema(BaseModel):
    condition_name: str

    class Config:
        from_attributes = True

class LabValueSchema(BaseModel):
    lab_name: str
    value: float
    unit: Optional[str] = None

    class Config:
        from_attributes = True

class PatientCreate(BaseModel):
    patient_name: Optional[str] = "Anonymous Candidate"
    phone_number: Optional[str] = "+91 98765 43210"
    hospital_name: Optional[str] = "Tata Memorial Hospital, Mumbai"
    treating_physician: Optional[str] = "Dr. Vikram Adani, MD"
    email: Optional[str] = None

    age: int
    gender: str
    country: str = "India"
    state_city: Optional[str] = "Mumbai"
    primary_condition: str
    disease_stage: Optional[str] = None
    prior_trial_participation: Optional[str] = "No"
    allergies: Optional[str] = None
    unstructured_notes: Optional[str] = None
    
    biomarkers: Optional[List[BiomarkerSchema]] = []
    treatments: Optional[List[TreatmentSchema]] = []
    comorbidities: Optional[List[ComorbiditySchema]] = []
    lab_values: Optional[List[LabValueSchema]] = []

class PatientResponse(PatientCreate):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True

class UnstructuredExtractInput(BaseModel):
    clinical_text: str

class ExtractedPatientData(BaseModel):
    patient_name: Optional[str] = None
    phone_number: Optional[str] = None
    hospital_name: Optional[str] = None
    treating_physician: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    primary_condition: Optional[str] = None
    disease_stage: Optional[str] = None
    biomarkers: List[Dict[str, str]] = []
    treatments: List[str] = []
    comorbidities: List[str] = []
    confidence_score: float = 0.95
    saved_patient_id: Optional[int] = None
