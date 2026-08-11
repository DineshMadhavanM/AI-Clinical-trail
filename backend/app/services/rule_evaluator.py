from typing import List, Dict, Tuple, Any
from app.models.patient import Patient
from app.models.trial import ClinicalTrial
from app.schemas.matching import MatchFactor

class RuleEvaluator:
    """
    Evaluates hard clinical eligibility rules between a Patient profile and a ClinicalTrial.
    Generates granular pass/warning/fail factors for Explainable AI (XAI).
    """

    def evaluate(self, patient: Patient, trial: ClinicalTrial) -> Tuple[float, List[MatchFactor], List[MatchFactor]]:
        matching_factors: List[MatchFactor] = []
        potential_issues: List[MatchFactor] = []

        total_rules = 0
        passed_rules = 0

        # 1. AGE REQUIREMENT
        total_rules += 1
        age_min = trial.min_age or 0
        age_max = trial.max_age or 120
        if age_min <= patient.age <= age_max:
            passed_rules += 1
            matching_factors.append(MatchFactor(
                category="AGE",
                factor_name="Age Requirement",
                patient_value=f"{patient.age} years",
                trial_requirement=f"{age_min} - {age_max} years",
                status="PASS",
                details=f"Patient age ({patient.age}) satisfies trial age bounds ({age_min}-{age_max})."
            ))
        else:
            potential_issues.append(MatchFactor(
                category="AGE",
                factor_name="Age Requirement",
                patient_value=f"{patient.age} years",
                trial_requirement=f"{age_min} - {age_max} years",
                status="FAIL",
                details=f"Patient age ({patient.age}) is outside trial eligibility criteria ({age_min}-{age_max})."
            ))

        # 2. GENDER REQUIREMENT
        total_rules += 1
        req_gender = (trial.gender_requirement or "All").lower()
        pat_gender = (patient.gender or "All").lower()
        if req_gender in ["all", "both"] or req_gender == pat_gender:
            passed_rules += 1
            matching_factors.append(MatchFactor(
                category="GENDER",
                factor_name="Gender Requirement",
                patient_value=patient.gender,
                trial_requirement=trial.gender_requirement or "All",
                status="PASS",
                details="Patient gender matches trial requirement."
            ))
        else:
            potential_issues.append(MatchFactor(
                category="GENDER",
                factor_name="Gender Requirement",
                patient_value=patient.gender,
                trial_requirement=trial.gender_requirement,
                status="FAIL",
                details=f"Trial requires {trial.gender_requirement}, but patient is {patient.gender}."
            ))

        # 3. CONDITION MATCH
        total_rules += 1
        pat_cond = (patient.primary_condition or "").lower()
        trial_cond = (trial.condition or "").lower()
        
        # Check direct substring or key overlap
        cond_match = (
            pat_cond in trial_cond or 
            trial_cond in pat_cond or 
            any(w in trial_cond for w in pat_cond.split() if len(w) > 3)
        )
        if cond_match:
            passed_rules += 1
            matching_factors.append(MatchFactor(
                category="CONDITION",
                factor_name="Primary Condition",
                patient_value=patient.primary_condition,
                trial_requirement=trial.condition,
                status="PASS",
                details=f"Patient condition '{patient.primary_condition}' aligns with trial condition '{trial.condition}'."
            ))
        else:
            potential_issues.append(MatchFactor(
                category="CONDITION",
                factor_name="Primary Condition",
                patient_value=patient.primary_condition,
                trial_requirement=trial.condition,
                status="WARNING",
                details=f"Patient condition '{patient.primary_condition}' may differ from trial target '{trial.condition}'."
            ))

        # 4. BIOMARKER MATCHING
        trial_inclusions = [c.raw_text for c in trial.criteria if c.criterion_type == "inclusion"]
        trial_exclusions = [c.raw_text for c in trial.criteria if c.criterion_type == "exclusion"]

        patient_bm_dict = {bm.marker_name.upper(): bm.status for bm in (patient.biomarkers or [])}
        
        for inc in trial_inclusions:
            inc_upper = inc.upper()
            for bm_name, bm_status in patient_bm_dict.items():
                if bm_name in inc_upper:
                    total_rules += 1
                    if "POSITIVE" in inc_upper or "+" in inc_upper or "MUTAT" in inc_upper:
                        if bm_status.upper() in ["POSITIVE", "MUTATED"]:
                            passed_rules += 1
                            matching_factors.append(MatchFactor(
                                category="BIOMARKER",
                                factor_name=f"Biomarker {bm_name}",
                                patient_value=f"{bm_name} {bm_status}",
                                trial_requirement=inc[:80] + "...",
                                status="PASS",
                                details=f"Required biomarker {bm_name} detected with status {bm_status}."
                            ))
                        else:
                            potential_issues.append(MatchFactor(
                                category="BIOMARKER",
                                factor_name=f"Biomarker {bm_name}",
                                patient_value=f"{bm_name} {bm_status}",
                                trial_requirement=inc[:80] + "...",
                                status="FAIL",
                                details=f"Trial requires positive/mutated {bm_name}, but patient has {bm_status}."
                            ))

        # 5. EXCLUSION CRITERIA CHECK
        patient_treatments = [t.treatment_name.lower() for t in (patient.treatments or [])]
        patient_comorbidities = [c.condition_name.lower() for c in (patient.comorbidities or [])]

        for exc in trial_exclusions:
            exc_lower = exc.lower()
            # Check if any patient comorbidity or treatment triggers exclusion
            for com in patient_comorbidities:
                if com in exc_lower and len(com) > 3:
                    total_rules += 1
                    potential_issues.append(MatchFactor(
                        category="EXCLUSION",
                        factor_name=f"Exclusion Risk ({com.capitalize()})",
                        patient_value=com.capitalize(),
                        trial_requirement=f"Excludes patients with: {exc[:100]}...",
                        status="FAIL",
                        details=f"Trial explicitly excludes patients with condition '{com.capitalize()}'."
                    ))

        # Compute deterministic rule score (0.0 to 1.0)
        rule_score = round(passed_rules / max(1, total_rules), 2)
        return rule_score, matching_factors, potential_issues

rule_evaluator = RuleEvaluator()
