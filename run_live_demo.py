"""
Live AI Clinical Trial Matching & Prediction Execution Script
Runs real-time patient profile matching against stored protocols.
"""

from app.core.database import SessionLocal
from app.models.patient import Patient, PatientBiomarker, PatientTreatment
from app.models.trial import ClinicalTrial
from app.services.hybrid_matcher import hybrid_matcher
from data.seed_data import seed_clinical_trials_database

def main():
    db = SessionLocal()
    seed_clinical_trials_database(db)

    # Real-time Patient Input Candidate
    patient = Patient(
        age=74,
        gender="Male",
        primary_condition="Alzheimer's Disease",
        disease_stage="Early Stage",
        country="India",
        state_city="Mumbai"
    )
    patient.biomarkers.append(PatientBiomarker(marker_name="AMYLOID", status="Positive"))

    all_trials = db.query(ClinicalTrial).all()
    results = hybrid_matcher.match_patient_against_trials(db=db, patient=patient, trials=all_trials)

    print("=" * 70)
    print("          REAL-TIME AI CLINICAL TRIAL MATCHING RESULTS          ")
    print("=" * 70)
    print(f"PATIENT PROFILE: {patient.age} y/o {patient.gender} | Condition: {patient.primary_condition} | Stage: {patient.disease_stage}\n")

    for i, res in enumerate(results[:5], 1):
        t = res.trial
        print(f"#{i} [{res.eligibility_status}] {t.id} - {t.title}")
        print(f"   - Total Match Score : {res.total_score * 100:.1f}%")
        print(f"   - Rules Score: {res.rule_score * 100:.1f}% | Vector Sim: {res.semantic_score * 100:.1f}%")
        print("   - Satisfied Factors:")
        for f in res.matching_factors[:3]:
            print(f"      * [PASS] {f.factor_name}: {f.details}")
        if res.potential_issues:
            print("   - Discrepancies / Warnings:")
            for f in res.potential_issues[:2]:
                print(f"      * [{f.status}] {f.factor_name}: {f.details}")
        print("-" * 70)

if __name__ == "__main__":
    main()
