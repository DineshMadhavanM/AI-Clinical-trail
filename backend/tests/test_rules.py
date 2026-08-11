import pytest
from app.models.patient import Patient, PatientBiomarker, PatientTreatment, PatientComorbidity
from app.models.trial import ClinicalTrial, TrialCriteria
from app.services.rule_evaluator import rule_evaluator

def test_age_rule_evaluation_pass():
    patient = Patient(age=55, gender="Male", primary_condition="Lung Cancer")
    trial = ClinicalTrial(id="NCT001", min_age=18, max_age=70, gender_requirement="All", condition="Lung Cancer")
    
    score, matching, issues = rule_evaluator.evaluate(patient, trial)
    assert score >= 0.6
    assert any(m.category == "AGE" and m.status == "PASS" for m in matching)

def test_age_rule_evaluation_fail():
    patient = Patient(age=80, gender="Male", primary_condition="Lung Cancer")
    trial = ClinicalTrial(id="NCT001", min_age=18, max_age=70, gender_requirement="All", condition="Lung Cancer")
    
    score, matching, issues = rule_evaluator.evaluate(patient, trial)
    assert any(i.category == "AGE" and i.status == "FAIL" for i in issues)

def test_gender_rule_evaluation():
    patient = Patient(age=45, gender="Male", primary_condition="Breast Cancer")
    trial = ClinicalTrial(id="NCT002", min_age=18, max_age=70, gender_requirement="Female", condition="Breast Cancer")
    
    score, matching, issues = rule_evaluator.evaluate(patient, trial)
    assert any(i.category == "GENDER" and i.status == "FAIL" for i in issues)
