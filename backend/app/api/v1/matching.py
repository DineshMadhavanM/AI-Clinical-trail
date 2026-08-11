from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.patient import Patient
from app.models.trial import ClinicalTrial
from app.schemas.matching import MatchRequest, TrialMatchRequest, MatchResultResponse, PatientMatchResultResponse
from app.services.hybrid_matcher import hybrid_matcher

router = APIRouter(prefix="/matching", tags=["AI Matching & Eligibility"])

@router.post("", response_model=List[MatchResultResponse])
def run_patient_trial_matching(request: MatchRequest, db: Session = Depends(get_db)):
    """
    Workflow 1 (Patient Input -> Matched Trial Protocols Output):
    Finds and ranks clinical trial protocols for a candidate patient.
    """
    patient = db.query(Patient).filter(Patient.id == request.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail=f"Patient profile #{request.patient_id} not found.")

    trials = db.query(ClinicalTrial).all()
    if not trials:
        return []

    results = hybrid_matcher.match_patient_against_trials(
        db=db,
        patient=patient,
        trials=trials,
        weight_eligibility=request.weight_eligibility or 0.40,
        weight_semantic=request.weight_semantic or 0.30,
        weight_condition=request.weight_condition or 0.15,
        weight_location=request.weight_location or 0.10,
        weight_status=request.weight_status or 0.05
    )

    return results[:request.top_k]

@router.post("/trial-candidates", response_model=List[PatientMatchResultResponse])
def run_trial_patient_candidate_matching(request: TrialMatchRequest, db: Session = Depends(get_db)):
    """
    Workflow 2 (Trial Protocol Input -> Eligible Patient Candidates Output):
    Finds and ranks patient candidates for a targeted trial protocol (Reverse Candidate Recruitment).
    """
    trial = db.query(ClinicalTrial).filter(ClinicalTrial.id == request.trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail=f"Clinical trial protocol {request.trial_id} not found.")

    patients = db.query(Patient).all()
    if not patients:
        return []

    results = hybrid_matcher.match_trial_against_patients(
        db=db,
        trial=trial,
        patients=patients,
        weight_eligibility=request.weight_eligibility or 0.40,
        weight_semantic=request.weight_semantic or 0.30,
        weight_condition=request.weight_condition or 0.15,
        weight_location=request.weight_location or 0.10,
        weight_status=request.weight_status or 0.05
    )

    return results[:request.top_k]
