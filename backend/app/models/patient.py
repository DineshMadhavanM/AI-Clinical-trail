from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Personal & Institutional Identifiers
    patient_name = Column(String, nullable=True, default="Anonymous Candidate")
    phone_number = Column(String, nullable=True, default="+91 98765 43210")
    hospital_name = Column(String, nullable=True, default="Tata Memorial Centre, Mumbai")
    treating_physician = Column(String, nullable=True, default="Dr. Vikram Adani, MD")
    email = Column(String, nullable=True)

    # Structured demographics
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)  # 'Male', 'Female', 'All'
    country = Column(String, nullable=False, default="India")
    state_city = Column(String, nullable=True)
    
    # Clinical parameters
    primary_condition = Column(String, index=True, nullable=False)
    disease_stage = Column(String, nullable=True)  # Stage I, II, III, IV, Metastatic
    prior_trial_participation = Column(String, nullable=True, default="No")
    allergies = Column(Text, nullable=True)
    unstructured_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="patient_profile")
    biomarkers = relationship("PatientBiomarker", back_populates="patient", cascade="all, delete-orphan")
    treatments = relationship("PatientTreatment", back_populates="patient", cascade="all, delete-orphan")
    comorbidities = relationship("PatientComorbidity", back_populates="patient", cascade="all, delete-orphan")
    lab_values = relationship("PatientLabValue", back_populates="patient", cascade="all, delete-orphan")
    match_results = relationship("MatchResult", back_populates="patient", cascade="all, delete-orphan")

class PatientBiomarker(Base):
    __tablename__ = "patient_biomarkers"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    marker_name = Column(String, nullable=False)  # e.g., EGFR, HER2, PD-L1, BRCA1
    status = Column(String, nullable=False)       # 'Positive', 'Negative', 'Mutated', 'Unknown'

    patient = relationship("Patient", back_populates="biomarkers")

class PatientTreatment(Base):
    __tablename__ = "patient_treatments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    treatment_name = Column(String, nullable=False) # e.g. Chemotherapy, Immunotherapy
    treatment_type = Column(String, default="prior") # 'prior', 'current'

    patient = relationship("Patient", back_populates="treatments")

class PatientComorbidity(Base):
    __tablename__ = "patient_comorbidities"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    condition_name = Column(String, nullable=False) # e.g., Hypertension, Diabetes

    patient = relationship("Patient", back_populates="comorbidities")

class PatientLabValue(Base):
    __tablename__ = "patient_lab_values"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    lab_name = Column(String, nullable=False)  # e.g., WBC, Hb, Creatinine, ALT/AST
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=True)

    patient = relationship("Patient", back_populates="lab_values")
