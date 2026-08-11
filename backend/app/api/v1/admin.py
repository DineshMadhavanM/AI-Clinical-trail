from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.trial import ClinicalTrial
from app.models.patient import Patient
from app.models.user import User
from data.seed_data import seed_clinical_trials_database

router = APIRouter(prefix="/admin", tags=["Admin & System Stats"])

@router.get("/stats")
def get_system_statistics(db: Session = Depends(get_db)):
    total_trials = db.query(ClinicalTrial).count()
    recruiting_trials = db.query(ClinicalTrial).filter(ClinicalTrial.status == "Recruiting").count()
    total_patients = db.query(Patient).count()
    total_users = db.query(User).count()

    # Phase breakdown
    phases = {}
    for p in ["Phase 1", "Phase 2", "Phase 3", "Phase 4"]:
        phases[p] = db.query(ClinicalTrial).filter(ClinicalTrial.phase == p).count()

    return {
        "total_trials": total_trials,
        "recruiting_trials": recruiting_trials,
        "total_patients": total_patients,
        "total_users": total_users,
        "phase_breakdown": phases,
        "system_status": "Healthy / Operational"
    }

@router.post("/seed-dataset")
def trigger_database_seed(db: Session = Depends(get_db)):
    count = seed_clinical_trials_database(db)
    return {"message": f"Clinical trials dataset successfully seeded with {count} protocols."}
