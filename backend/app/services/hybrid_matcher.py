from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.models.trial import ClinicalTrial
from app.services.rule_evaluator import rule_evaluator
from app.services.vector_store import vector_store
from app.schemas.matching import MatchResultResponse, PatientMatchResultResponse, MatchFactor
from datetime import datetime

class HybridMatcher:
    """
    Hybrid Clinical Trial Matching Engine supporting both:
    1. Patient -> Trials Matching (Find suitable trial protocols for a patient)
    2. Trial -> Patients Matching (Find eligible patient candidates for a trial protocol)
    """

    def match_patient_against_trials(
        self,
        db: Session,
        patient: Patient,
        trials: List[ClinicalTrial],
        weight_eligibility: float = 0.40,
        weight_semantic: float = 0.30,
        weight_condition: float = 0.15,
        weight_location: float = 0.10,
        weight_status: float = 0.05
    ) -> List[MatchResultResponse]:

        # Build query text for patient vector search
        patient_text = f"Patient: Age {patient.age}, {patient.gender}. Condition: {patient.primary_condition}. Stage: {patient.disease_stage or 'N/A'}. "
        patient_text += "Biomarkers: " + ", ".join([f"{b.marker_name} {b.status}" for b in (patient.biomarkers or [])]) + ". "
        patient_text += "Treatments: " + ", ".join([t.treatment_name for t in (patient.treatments or [])]) + ". "
        if patient.unstructured_notes:
            patient_text += f" Notes: {patient.unstructured_notes}"

        # Index current trials in vector store
        trials_corpus = []
        for t in trials:
            criteria_text = " ".join([c.raw_text for c in (t.criteria or [])])
            text = f"{t.title} {t.official_title or ''} Condition: {t.condition}. Summary: {t.brief_summary or ''}. Criteria: {criteria_text}"
            trials_corpus.append({"id": t.id, "text": text})
        
        vector_store.index_trials(trials_corpus)
        semantic_scores = vector_store.calculate_similarity(patient_text)

        results: List[MatchResultResponse] = []

        for trial in trials:
            rule_score, matching_factors, potential_issues = rule_evaluator.evaluate(patient, trial)
            sem_score = semantic_scores.get(trial.id, 0.50)

            pat_c = (patient.primary_condition or "").lower()
            trial_c = (trial.condition or "").lower()
            if pat_c == trial_c:
                cond_score = 1.0
            elif pat_c in trial_c or trial_c in pat_c:
                cond_score = 0.85
            else:
                cond_score = 0.40

            trial_locs = [l.country.lower() for l in (trial.locations or [])]
            pat_country = (patient.country or "Global").lower()
            if pat_country in trial_locs or "global" in trial_locs or not trial_locs:
                loc_score = 1.0
            else:
                loc_score = 0.50

            st = (trial.status or "").lower()
            if "recruiting" in st:
                status_score = 1.0
            elif "active" in st:
                status_score = 0.70
            else:
                status_score = 0.30

            total_score = round(
                (weight_eligibility * rule_score) +
                (weight_semantic * sem_score) +
                (weight_condition * cond_score) +
                (weight_location * loc_score) +
                (weight_status * status_score),
                3
            )

            if total_score >= 0.78:
                eligibility_status = "LIKELY_MATCH"
            elif total_score >= 0.62:
                eligibility_status = "POSSIBLE_MATCH"
            elif total_score >= 0.48:
                eligibility_status = "NEEDS_REVIEW"
            else:
                eligibility_status = "UNLIKELY_MATCH"

            from app.schemas.trial import TrialResponse
            trial_schema = TrialResponse.model_validate(trial)

            res = MatchResultResponse(
                trial_id=trial.id,
                trial=trial_schema,
                total_score=total_score,
                eligibility_status=eligibility_status,
                rule_score=rule_score,
                semantic_score=round(sem_score, 3),
                condition_score=cond_score,
                location_score=loc_score,
                status_score=status_score,
                matching_factors=matching_factors,
                potential_issues=potential_issues,
                calculated_at=datetime.utcnow()
            )
            results.append(res)

        results.sort(key=lambda x: x.total_score, reverse=True)
        return results

    def match_trial_against_patients(
        self,
        db: Session,
        trial: ClinicalTrial,
        patients: List[Patient],
        weight_eligibility: float = 0.40,
        weight_semantic: float = 0.30,
        weight_condition: float = 0.15,
        weight_location: float = 0.10,
        weight_status: float = 0.05
    ) -> List[PatientMatchResultResponse]:
        """
        Reverse Candidate Screening: Evaluates a single Trial Protocol against all Patient Candidates.
        """
        criteria_text = " ".join([c.raw_text for c in (trial.criteria or [])])
        trial_text = f"{trial.title} {trial.official_title or ''} Condition: {trial.condition}. Summary: {trial.brief_summary or ''}. Criteria: {criteria_text}"

        # Index patient documents for semantic retrieval
        patient_corpus = []
        for p in patients:
            p_text = f"Patient {p.id}: Age {p.age}, {p.gender}. Condition: {p.primary_condition}. Stage: {p.disease_stage or 'N/A'}. "
            p_text += "Biomarkers: " + ", ".join([f"{b.marker_name} {b.status}" for b in (p.biomarkers or [])]) + ". "
            p_text += "Treatments: " + ", ".join([t.treatment_name for t in (p.treatments or [])]) + ". "
            if p.unstructured_notes:
                p_text += f" Notes: {p.unstructured_notes}"
            patient_corpus.append({"id": str(p.id), "text": p_text})

        vector_store.index_trials(patient_corpus)
        semantic_scores = vector_store.calculate_similarity(trial_text)

        results: List[PatientMatchResultResponse] = []

        for patient in patients:
            rule_score, matching_factors, potential_issues = rule_evaluator.evaluate(patient, trial)
            sem_score = semantic_scores.get(str(patient.id), 0.50)

            pat_c = (patient.primary_condition or "").lower()
            trial_c = (trial.condition or "").lower()
            if pat_c == trial_c:
                cond_score = 1.0
            elif pat_c in trial_c or trial_c in pat_c:
                cond_score = 0.85
            else:
                cond_score = 0.40

            trial_locs = [l.country.lower() for l in (trial.locations or [])]
            pat_country = (patient.country or "Global").lower()
            if pat_country in trial_locs or "global" in trial_locs or not trial_locs:
                loc_score = 1.0
            else:
                loc_score = 0.50

            st = (trial.status or "").lower()
            if "recruiting" in st:
                status_score = 1.0
            elif "active" in st:
                status_score = 0.70
            else:
                status_score = 0.30

            total_score = round(
                (weight_eligibility * rule_score) +
                (weight_semantic * sem_score) +
                (weight_condition * cond_score) +
                (weight_location * loc_score) +
                (weight_status * status_score),
                3
            )

            if total_score >= 0.78:
                eligibility_status = "LIKELY_MATCH"
            elif total_score >= 0.62:
                eligibility_status = "POSSIBLE_MATCH"
            elif total_score >= 0.48:
                eligibility_status = "NEEDS_REVIEW"
            else:
                eligibility_status = "UNLIKELY_MATCH"

            from app.schemas.patient import PatientResponse
            patient_schema = PatientResponse.model_validate(patient)

            res = PatientMatchResultResponse(
                patient_id=patient.id,
                patient=patient_schema,
                total_score=total_score,
                eligibility_status=eligibility_status,
                rule_score=rule_score,
                semantic_score=round(sem_score, 3),
                condition_score=cond_score,
                location_score=loc_score,
                status_score=status_score,
                matching_factors=matching_factors,
                potential_issues=potential_issues,
                calculated_at=datetime.utcnow()
            )
            results.append(res)

        results.sort(key=lambda x: x.total_score, reverse=True)
        return results

hybrid_matcher = HybridMatcher()
