import io
import json
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.patient import (
    Patient, PatientBiomarker, PatientTreatment, PatientComorbidity, PatientLabValue
)
from app.schemas.patient import (
    PatientCreate, PatientResponse, UnstructuredExtractInput, ExtractedPatientData
)
from app.services.nlp_extractor import nlp_extractor

router = APIRouter(prefix="/patients", tags=["Patient Profiles"])

@router.post("/extract-text", response_model=ExtractedPatientData)
def extract_medical_information(input_data: UnstructuredExtractInput):
    """
    Extracts structured medical entities (age, gender, condition, stage, biomarkers, treatments)
    from unstructured clinical text narrative using NLP.
    """
    if not input_data.clinical_text or len(input_data.clinical_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Clinical text narrative cannot be empty.")
    
    extracted = nlp_extractor.extract(input_data.clinical_text)
    return extracted

@router.post("/upload-document", response_model=ExtractedPatientData)
async def upload_medical_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """
    Uploads a patient medical file (PDF, TXT, DOCX, CSV, JSON), extracts patient details,
    automatically creates & stores the patient profile in the database, and returns extracted data.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file must have a valid filename.")

    content = await file.read()
    filename = file.filename.lower()

    extracted_text = ""
    json_data = None

    try:
        if filename.endswith(".json"):
            try:
                json_data = json.loads(content.decode("utf-8", errors="ignore"))
                extracted_text = json.dumps(json_data, indent=2)
            except Exception:
                extracted_text = content.decode("utf-8", errors="ignore")

        elif filename.endswith(".docx") or filename.endswith(".doc"):
            try:
                import docx
                doc = docx.Document(io.BytesIO(content))
                extracted_text = " ".join([p.text for p in doc.paragraphs if p.text])
            except Exception:
                extracted_text = content.decode("utf-8", errors="ignore")

        elif filename.endswith(".pdf"):
            try:
                import pypdf
                reader = pypdf.PdfReader(io.BytesIO(content))
                extracted_text = " ".join([page.extract_text() for page in reader.pages if page.extract_text()])
            except Exception:
                extracted_text = content.decode("utf-8", errors="ignore")

        else:
            extracted_text = content.decode("utf-8", errors="ignore")

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse uploaded document: {str(e)}")

    if not extracted_text or len(extracted_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Could not extract readable text from uploaded file.")

    # Extract clinical parameters via NLP Extractor
    extracted = nlp_extractor.extract(extracted_text)

    # Check if JSON file contains explicit patient fields
    p_name = None
    p_phone = None
    p_hosp = None
    p_doc = None

    if json_data and isinstance(json_data, dict):
        p_name = json_data.get("patient_name") or json_data.get("name")
        p_phone = json_data.get("phone_number") or json_data.get("phone")
        p_hosp = json_data.get("hospital_name") or json_data.get("hospital")
        p_doc = json_data.get("treating_physician") or json_data.get("physician") or json_data.get("doctor")

    # Generate default profile values if unspecified
    clean_filename = file.filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
    p_name = p_name or extracted.patient_name or f"Patient ({clean_filename})"
    p_phone = p_phone or extracted.phone_number or "+91 98765 43210"
    p_hosp = p_hosp or extracted.hospital_name or "Tata Memorial Hospital, Mumbai"
    p_doc = p_doc or extracted.treating_physician or "Dr. Vikram Adani, MD"

    # Save patient profile directly into SQLite Database
    new_patient = Patient(
        patient_name=p_name,
        phone_number=p_phone,
        hospital_name=p_hosp,
        treating_physician=p_doc,
        age=extracted.age or 55,
        gender=extracted.gender or "Male",
        country="India",
        state_city="Mumbai",
        primary_condition=extracted.primary_condition or "Non-Small Cell Lung Cancer",
        disease_stage=extracted.disease_stage or "Stage III",
        unstructured_notes=f"Uploaded Medical File: {file.filename}\nNarrative Text:\n{extracted_text[:600]}"
    )
    db.add(new_patient)
    db.flush()

    # Save Biomarkers
    if extracted.biomarkers:
        for bm in extracted.biomarkers:
            if isinstance(bm, dict):
                db.add(PatientBiomarker(patient_id=new_patient.id, marker_name=bm.get("marker_name", "EGFR"), status=bm.get("status", "Positive")))

    # Save Treatments
    if extracted.treatments:
        for tr in extracted.treatments:
            if isinstance(tr, str):
                db.add(PatientTreatment(patient_id=new_patient.id, treatment_name=tr, treatment_type="prior"))

    db.commit()
    db.refresh(new_patient)

    # Attach saved patient ID & identifiers to response
    extracted.saved_patient_id = new_patient.id
    extracted.patient_name = new_patient.patient_name
    extracted.phone_number = new_patient.phone_number
    extracted.hospital_name = new_patient.hospital_name
    extracted.treating_physician = new_patient.treating_physician

    return extracted

@router.post("", response_model=PatientResponse)
def create_patient_profile(patient_in: PatientCreate, db: Session = Depends(get_db)):
    """
    Saves a new patient profile with structured biomarkers, treatments, comorbidities, and lab values.
    """
    patient = Patient(
        patient_name=patient_in.patient_name or "Candidate Patient",
        phone_number=patient_in.phone_number or "+91 98765 43210",
        hospital_name=patient_in.hospital_name or "Tata Memorial Centre, Mumbai",
        treating_physician=patient_in.treating_physician or "Dr. Vikram Adani, MD",
        email=patient_in.email,
        age=patient_in.age,
        gender=patient_in.gender,
        country=patient_in.country,
        state_city=patient_in.state_city,
        primary_condition=patient_in.primary_condition,
        disease_stage=patient_in.disease_stage,
        prior_trial_participation=patient_in.prior_trial_participation,
        allergies=patient_in.allergies,
        unstructured_notes=patient_in.unstructured_notes
    )
    db.add(patient)
    db.flush()

    # Add Biomarkers
    if patient_in.biomarkers:
        for bm in patient_in.biomarkers:
            db.add(PatientBiomarker(patient_id=patient.id, marker_name=bm.marker_name, status=bm.status))

    # Add Treatments
    if patient_in.treatments:
        for tr in patient_in.treatments:
            db.add(PatientTreatment(patient_id=patient.id, treatment_name=tr.treatment_name, treatment_type=tr.treatment_type or "prior"))

    # Add Comorbidities
    if patient_in.comorbidities:
        for cm in patient_in.comorbidities:
            db.add(PatientComorbidity(patient_id=patient.id, condition_name=cm.condition_name))

    # Add Lab Values
    if patient_in.lab_values:
        for lv in patient_in.lab_values:
            db.add(PatientLabValue(patient_id=patient.id, lab_name=lv.lab_name, value=lv.value, unit=lv.unit))

    db.commit()
    db.refresh(patient)
    return patient

@router.get("", response_model=List[PatientResponse])
def get_all_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient_by_id(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")
    return patient

from pydantic import BaseModel
class ConfirmTrialPayload(BaseModel):
    trial_id: str
    trial_title: str

@router.post("/{patient_id}/confirm-trial", response_model=PatientResponse)
def confirm_patient_trial(patient_id: int, payload: ConfirmTrialPayload, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient profile not found.")
    patient.confirmed_trial_id = payload.trial_id
    patient.confirmed_trial_title = payload.trial_title
    db.commit()
    db.refresh(patient)
    return patient
