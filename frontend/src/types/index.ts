export type UserRole = 'PATIENT' | 'HEALTHCARE_PRO' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Biomarker {
  marker_name: string;
  status: 'Positive' | 'Negative' | 'Mutated' | 'Unknown';
}

export interface Treatment {
  treatment_name: string;
  treatment_type?: string;
}

export interface Comorbidity {
  condition_name: string;
}

export interface LabValue {
  lab_name: string;
  value: number;
  unit?: string;
}

export interface Patient {
  id: number;
  user_id?: number;
  patient_name?: string;
  phone_number?: string;
  hospital_name?: string;
  treating_physician?: string;
  email?: string;
  age: number;
  gender: string;
  country: string;
  state_city?: string;
  primary_condition: string;
  disease_stage?: string;
  prior_trial_participation?: string;
  allergies?: string;
  unstructured_notes?: string;
  biomarkers: Biomarker[];
  treatments: Treatment[];
  comorbidities: Comorbidity[];
  lab_values: LabValue[];
  confirmed_trial_id?: string;
  confirmed_trial_title?: string;
  created_at: string;
}

export interface ExtractedPatientData {
  patient_name?: string;
  phone_number?: string;
  hospital_name?: string;
  treating_physician?: string;
  age?: number;
  gender?: string;
  primary_condition?: string;
  disease_stage?: string;
  biomarkers: { marker_name: string; status: string }[];
  treatments: string[];
  comorbidities: string[];
  confidence_score: number;
  saved_patient_id?: number;
}

export interface TrialLocation {
  country: string;
  city?: string;
  facility_name?: string;
}

export interface TrialCriteria {
  criterion_type: 'inclusion' | 'exclusion';
  raw_text: string;
  category?: string;
}

export interface ClinicalTrial {
  id: string;
  title: string;
  official_title?: string;
  condition: string;
  brief_summary?: string;
  detailed_description?: string;
  phase: string;
  study_type?: string;
  status: string;
  min_age: number;
  max_age: number;
  gender_requirement: string;
  intervention?: string;
  sponsor?: string;
  study_start?: string;
  primary_completion?: string;
  locations: TrialLocation[];
  criteria: TrialCriteria[];
}

export interface MatchFactor {
  category: string;
  factor_name: string;
  patient_value: string;
  trial_requirement: string;
  status: 'PASS' | 'WARNING' | 'FAIL' | 'UNKNOWN';
  details: string;
}

export interface MatchResult {
  trial_id: string;
  trial: ClinicalTrial;
  patient?: Patient;
  total_score: number;
  eligibility_status: 'LIKELY_MATCH' | 'POSSIBLE_MATCH' | 'NEEDS_REVIEW' | 'UNLIKELY_MATCH';
  rule_score: number;
  semantic_score: number;
  condition_score: number;
  location_score: number;
  status_score: number;
  matching_factors: MatchFactor[];
  potential_issues: MatchFactor[];
  calculated_at: string;
}

export interface PatientMatchResult {
  patient_id: number;
  patient: Patient;
  trial?: ClinicalTrial;
  total_score: number;
  eligibility_status: 'LIKELY_MATCH' | 'POSSIBLE_MATCH' | 'NEEDS_REVIEW' | 'UNLIKELY_MATCH';
  rule_score: number;
  semantic_score: number;
  condition_score: number;
  location_score: number;
  status_score: number;
  matching_factors: MatchFactor[];
  potential_issues: MatchFactor[];
  calculated_at: string;
}

export interface RAGQueryResponse {
  trial_id: string;
  question: string;
  answer: string;
  sources: string[];
  disclaimer: string;
}
