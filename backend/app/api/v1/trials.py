from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.models.trial import ClinicalTrial, TrialLocation, TrialCriteria
from app.schemas.trial import TrialCreate, TrialResponse, TrialFilterParams

router = APIRouter(prefix="/trials", tags=["Clinical Trials"])

@router.get("", response_model=List[TrialResponse])
def get_trials(
    condition: Optional[str] = None,
    phase: Optional[str] = None,
    status: Optional[str] = None,
    country: Optional[str] = None,
    query: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    q = db.query(ClinicalTrial)
    if condition:
        q = q.filter(ClinicalTrial.condition.ilike(f"%{condition}%"))
    if phase:
        q = q.filter(ClinicalTrial.phase == phase)
    if status:
        q = q.filter(ClinicalTrial.status == status)
    if country:
        q = q.join(TrialLocation).filter(TrialLocation.country.ilike(f"%{country}%"))
    if query:
        q = q.filter(
            (ClinicalTrial.title.ilike(f"%{query}%")) |
            (ClinicalTrial.brief_summary.ilike(f"%{query}%")) |
            (ClinicalTrial.condition.ilike(f"%{query}%")) |
            (ClinicalTrial.id.ilike(f"%{query}%"))
        )
    
    trials = q.distinct().offset(skip).limit(limit).all()
    return trials

@router.post("/search", response_model=List[TrialResponse])
def search_trials_post(params: TrialFilterParams, db: Session = Depends(get_db)):
    return get_trials(
        condition=params.condition,
        phase=params.phase,
        status=params.status,
        country=params.country,
        query=params.query,
        db=db
    )

@router.get("/{trial_id}", response_model=TrialResponse)
def get_trial_by_id(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(ClinicalTrial).filter(ClinicalTrial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail=f"Clinical trial {trial_id} not found.")
    return trial

@router.post("", response_model=TrialResponse)
def create_trial(trial_in: TrialCreate, db: Session = Depends(get_db)):
    existing = db.query(ClinicalTrial).filter(ClinicalTrial.id == trial_in.id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Trial with ID {trial_in.id} already exists.")
    
    trial = ClinicalTrial(
        id=trial_in.id,
        title=trial_in.title,
        official_title=trial_in.official_title,
        condition=trial_in.condition,
        brief_summary=trial_in.brief_summary,
        detailed_description=trial_in.detailed_description,
        phase=trial_in.phase,
        study_type=trial_in.study_type or "Interventional",
        status=trial_in.status or "Recruiting",
        min_age=trial_in.min_age,
        max_age=trial_in.max_age,
        gender_requirement=trial_in.gender_requirement or "All",
        intervention=trial_in.intervention,
        sponsor=trial_in.sponsor,
        study_start=trial_in.study_start,
        primary_completion=trial_in.primary_completion
    )
    db.add(trial)
    db.flush()

    if trial_in.locations:
        for loc in trial_in.locations:
            db.add(TrialLocation(trial_id=trial.id, country=loc.country, city=loc.city, facility_name=loc.facility_name))

    if trial_in.criteria:
        for crit in trial_in.criteria:
            db.add(TrialCriteria(trial_id=trial.id, criterion_type=crit.criterion_type, raw_text=crit.raw_text, category=crit.category or "GENERAL"))

    db.commit()
    db.refresh(trial)
    return trial

@router.delete("/{trial_id}")
def delete_trial(trial_id: str, db: Session = Depends(get_db)):
    trial = db.query(ClinicalTrial).filter(ClinicalTrial.id == trial_id).first()
    if not trial:
        raise HTTPException(status_code=404, detail="Trial not found")
    db.delete(trial)
    db.commit()
    return {"message": f"Trial {trial_id} deleted successfully."}
