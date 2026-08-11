from sqlalchemy.orm import Session
from app.models.trial import ClinicalTrial, TrialLocation, TrialCriteria
from app.models.patient import Patient, PatientBiomarker, PatientTreatment, PatientComorbidity

SAMPLE_TRIALS = [
    # 1. ONCOLOGY - NSCLC (NCT04512345)
    {
        "id": "NCT04512345",
        "title": "Phase III Study of Target-EGFR Inhibitor with Chemotherapy in Advanced Non-Small Cell Lung Cancer",
        "official_title": "A Randomized, Double-Blind Phase 3 Trial Evaluating Targeted Tyrosine Kinase Inhibitors Combined with Standard Platinum Chemotherapy in EGFR-Positive Non-Small Cell Lung Cancer",
        "condition": "Non-Small Cell Lung Cancer",
        "brief_summary": "Evaluates the efficacy and safety of targeted EGFR inhibitor therapy combined with chemotherapy for Stage III/IV NSCLC patients with confirmed EGFR exon 19 deletion or L858R mutation.",
        "detailed_description": "Patients with histologically confirmed Stage III or IV non-small cell lung cancer harboring EGFR sensitizing mutations are randomized 1:1 to receive oral targeted inhibitor or placebo alongside intravenous platinum-based chemotherapy.",
        "phase": "Phase 3",
        "study_type": "Interventional",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 75,
        "gender_requirement": "All",
        "intervention": "EGFR TKI Inhibitor (Targeted Drug) + Cisplatin/Pemetrexed",
        "sponsor": "OncoTech International & Global Lung Cancer Consortium",
        "study_start": "2024-01-15",
        "primary_completion": "2026-12-30",
        "locations": [
            {"country": "India", "city": "Mumbai", "facility_name": "Tata Memorial Centre"},
            {"country": "India", "city": "New Delhi", "facility_name": "AIIMS Comprehensive Cancer Center"},
            {"country": "United States", "city": "Boston", "facility_name": "Dana-Farber Cancer Institute"}
        ],
        "criteria": [
            {"criterion_type": "inclusion", "raw_text": "Age between 18 and 75 years at time of consent.", "category": "AGE"},
            {"criterion_type": "inclusion", "raw_text": "Histologically or cytologically confirmed Stage III or IV Non-Small Cell Lung Cancer.", "category": "STAGE"},
            {"criterion_type": "inclusion", "raw_text": "Confirmed EGFR positive exon 19 deletion or L858R mutation.", "category": "BIOMARKER"},
            {"criterion_type": "inclusion", "raw_text": "ECOG Performance Status 0 or 1.", "category": "GENERAL"},
            {"criterion_type": "exclusion", "raw_text": "Prior systemic treatment with EGFR-targeted small molecule inhibitors.", "category": "PRIOR_TREATMENT"},
            {"criterion_type": "exclusion", "raw_text": "Active symptomatic central nervous system (CNS) metastases.", "category": "COMORBIDITY"}
        ]
    },
    # 2. ONCOLOGY - BREAST CANCER (NCT04899120)
    {
        "id": "NCT04899120",
        "title": "Pembrolizumab Immunotherapy Combination for Triple-Negative Breast Cancer",
        "official_title": "Neoadjuvant Anti-PD-1 Immunotherapy Combined with Chemotherapy in Early-Stage Triple-Negative Breast Cancer",
        "condition": "Triple-Negative Breast Cancer",
        "brief_summary": "Assesses pathological complete response rate following PD-L1 immune checkpoint blockade combined with paclitaxel/carboplatin in patients with high-risk triple-negative breast cancer.",
        "phase": "Phase 2",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 70,
        "gender_requirement": "Female",
        "locations": [
            {"country": "India", "city": "Bengaluru", "facility_name": "Kidwai Memorial Institute of Oncology"}
        ],
        "criteria": [
            {"criterion_type": "inclusion", "raw_text": "Female candidates aged 18 to 70 years.", "category": "GENDER"},
            {"criterion_type": "inclusion", "raw_text": "Confirmed Triple-Negative Breast Cancer (ER-negative, PR-negative, HER2-negative).", "category": "BIOMARKER"}
        ]
    },
    # 3. ENDOCRINOLOGY - DIABETES (NCT05123488)
    {
        "id": "NCT05123488",
        "title": "Novel Oral SGLT2 Inhibitor in Patients with Type 2 Diabetes & Chronic Kidney Disease",
        "official_title": "Evaluation of Renal Protection and Glycemic Control with Next-Generation SGLT2 Dual Inhibitor in Adult Type 2 Diabetes",
        "condition": "Type 2 Diabetes",
        "brief_summary": "Evaluates HbA1c reduction and eGFR slope retention over 52 weeks in adult diabetic patients.",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 30,
        "max_age": 80,
        "gender_requirement": "All",
        "locations": [
            {"country": "India", "city": "Hyderabad", "facility_name": "Apollo Hospitals Clinical Research Unit"}
        ],
        "criteria": [
            {"criterion_type": "inclusion", "raw_text": "Patients aged 30 to 80 years with established Type 2 Diabetes Mellitus.", "category": "AGE"}
        ]
    },
    # 4. CARDIOLOGY - HEART FAILURE (NCT05400192)
    {
        "id": "NCT05400192",
        "title": "ARNI Dual Inhibitor vs ACE-I in Heart Failure with Reduced Ejection Fraction (HFrEF)",
        "official_title": "A Prospective Randomized Trial of Angiotensin Receptor-Neprilysin Inhibitor Therapy in Chronic Heart Failure Patients",
        "condition": "Heart Failure",
        "brief_summary": "Measures reduction in cardiovascular death and heart failure hospitalization in patients with LVEF <= 35%.",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 85,
        "gender_requirement": "All",
        "locations": [
            {"country": "India", "city": "Chennai", "facility_name": "Madras Medical Mission Heart Institute"}
        ],
        "criteria": [
            {"criterion_type": "inclusion", "raw_text": "Adults aged 18 to 85 with NYHA Class II-IV symptomatic heart failure.", "category": "AGE"}
        ]
    },
    # 5. NEUROLOGY - ALZHEIMER'S (NCT05988311)
    {
        "id": "NCT05988311",
        "title": "Anti-Amyloid Monoclonal Antibody Infusion for Early Alzheimer's Disease",
        "official_title": "Phase 2 Evaluation of Amyloid Plaque Clearance and Cognitive Stabilization in Early-Stage Symptomatic Alzheimer's Disease",
        "condition": "Alzheimer's Disease",
        "brief_summary": "Evaluates changes in CDR-SB cognitive rating scale and amyloid PET scan burden.",
        "phase": "Phase 2",
        "status": "Recruiting",
        "min_age": 55,
        "max_age": 80,
        "gender_requirement": "All",
        "locations": [
            {"country": "India", "city": "Mumbai", "facility_name": "Kokilaben Dhirubhai Ambani Hospital"}
        ],
        "criteria": [
            {"criterion_type": "inclusion", "raw_text": "Patients aged 55 to 80 years with MCI or mild Alzheimer's dementia.", "category": "AGE"}
        ]
    },
    # 6. ONCOLOGY - COLORECTAL CANCER (NCT06101920)
    {
        "id": "NCT06101920",
        "title": "KRAS-G12C Inhibitor Monotherapy in Metastatic Colorectal Cancer",
        "condition": "Colorectal Cancer",
        "phase": "Phase 2",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 78,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Mumbai", "facility_name": "Tata Memorial Centre"}]
    },
    # 7. ONCOLOGY - PROSTATE CANCER (NCT06203310)
    {
        "id": "NCT06203310",
        "title": "PSMA Radioligand Therapy in Metastatic Castration-Resistant Prostate Cancer",
        "condition": "Prostate Cancer",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 85,
        "gender_requirement": "Male",
        "locations": [{"country": "India", "city": "New Delhi", "facility_name": "Max Healthcare Super Speciality Hospital"}]
    },
    # 8. NEUROLOGY - PARKINSON'S (NCT06341280)
    {
        "id": "NCT06341280",
        "title": "Disease-Modifying Alpha-Synuclein Monoclonal Antibody for Early Parkinson's Disease",
        "condition": "Parkinson's Disease",
        "phase": "Phase 2",
        "status": "Recruiting",
        "min_age": 45,
        "max_age": 75,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Bengaluru", "facility_name": "NIMHANS Neuro Institute"}]
    },
    # 9. PULMONOLOGY - COPD (NCT06411290)
    {
        "id": "NCT06411290",
        "title": "Biologic Anti-IL-4/13 Inhalational Therapy for Eosinophilic COPD Exacerbations",
        "condition": "COPD",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 40,
        "max_age": 80,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Pune", "facility_name": "Chest Research Foundation Hospital"}]
    },
    # 10. DERMATOLOGY - ATOPIC DERMATITIS (NCT06522300)
    {
        "id": "NCT06522300",
        "title": "Oral JAK-1 Inhibitor vs Placebo in Moderate-to-Severe Atopic Dermatitis",
        "condition": "Atopic Dermatitis",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 12,
        "max_age": 65,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Mumbai", "facility_name": "KEM Hospital Dermatology Department"}]
    },
    # 11. ONCOLOGY - MELANOMA (NCT06600111)
    {
        "id": "NCT06600111",
        "title": "Neoadjuvant BRAF/MEK Targeted Combination in Stage III Mutated Melanoma",
        "condition": "Melanoma",
        "phase": "Phase 2",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 75,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Mumbai", "facility_name": "Tata Memorial Centre"}]
    },
    # 12. GASTROENTEROLOGY - CROHN'S (NCT06711222)
    {
        "id": "NCT06711222",
        "title": "Anti-TL1A Monoclonal Antibody Induction Therapy for Moderate-to-Severe Crohn's Disease",
        "condition": "Crohn's Disease",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 70,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "New Delhi", "facility_name": "Gastroenterology Research Center AIIMS"}]
    },
    # 13. HEMATOLOGY - MULTIPLE MYELOMA (NCT06822333)
    {
        "id": "NCT06822333",
        "title": "BCMA CAR-T Cell Immunotherapy for Relapsed or Refractory Multiple Myeloma",
        "condition": "Multiple Myeloma",
        "phase": "Phase 2",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 75,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Mumbai", "facility_name": "ACTREC Tata Memorial Centre"}]
    },
    # 14. NEPHROLOGY - FSGS (NCT06933444)
    {
        "id": "NCT06933444",
        "title": "Dual Endothelin and Angiotensin II Receptor Antagonist in Primary FSGS",
        "condition": "Focal Segmental Glomerulosclerosis",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 8,
        "max_age": 65,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Chennai", "facility_name": "CMC Vellore Nephrology Unit"}]
    },
    # 15. RHEUMATOLOGY - SLE (NCT07044555)
    {
        "id": "NCT07044555",
        "title": "Type I Interferon Receptor Monoclonal Antibody for Active Systemic Lupus Erythematosus",
        "condition": "Systemic Lupus Erythematosus",
        "phase": "Phase 3",
        "status": "Recruiting",
        "min_age": 18,
        "max_age": 70,
        "gender_requirement": "All",
        "locations": [{"country": "India", "city": "Chandigarh", "facility_name": "PGIMER Rheumatology Department"}]
    }
]

SAMPLE_PATIENTS = [
    # ----------------------------------------------------------------------
    # PATIENTS TAILORED FOR TARGET-EGFR NSCLC PROTOCOL (NCT04512345)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Rahul Sharma",
        "phone_number": "+91 98765 43210",
        "hospital_name": "Tata Memorial Centre, Mumbai",
        "treating_physician": "Dr. Vikram Adani, MD Medical Oncology",
        "email": "rahul.sharma@example.com",
        "age": 55,
        "gender": "Male",
        "country": "India",
        "state_city": "Mumbai",
        "primary_condition": "Non-Small Cell Lung Cancer",
        "disease_stage": "Stage III",
        "biomarkers": [{"marker_name": "EGFR", "status": "Positive"}],
        "treatments": [{"treatment_name": "Platinum Chemotherapy"}]
    },
    {
        "patient_name": "Dr. Rajesh Kulkarni",
        "phone_number": "+91 98200 11223",
        "hospital_name": "AIIMS Comprehensive Cancer Center, New Delhi",
        "treating_physician": "Dr. Sunanda Bose, DM Oncology",
        "email": "rajesh.kulkarni@example.com",
        "age": 62,
        "gender": "Male",
        "country": "India",
        "state_city": "New Delhi",
        "primary_condition": "Non-Small Cell Lung Cancer",
        "disease_stage": "Stage IV",
        "biomarkers": [{"marker_name": "EGFR", "status": "Positive"}],
        "treatments": [{"treatment_name": "Cisplatin/Pemetrexed"}]
    },
    {
        "patient_name": "Sunita Kapadia",
        "phone_number": "+91 97112 33445",
        "hospital_name": "Dana-Farber Cancer Institute, Boston / Tata Memorial",
        "treating_physician": "Dr. Arvind Swaminathan, MD",
        "email": "sunita.kapadia@example.com",
        "age": 58,
        "gender": "Female",
        "country": "India",
        "state_city": "Mumbai",
        "primary_condition": "Non-Small Cell Lung Cancer",
        "disease_stage": "Stage III",
        "biomarkers": [{"marker_name": "EGFR", "status": "Positive"}],
        "treatments": [{"treatment_name": "Cisplatin"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR TRIPLE-NEGATIVE BREAST CANCER (NCT04899120)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Priya Patel",
        "phone_number": "+91 91234 56789",
        "hospital_name": "Kidwai Memorial Institute of Oncology, Bengaluru",
        "treating_physician": "Dr. Sunita Mehta, DM Medical Oncology",
        "email": "priya.patel@example.com",
        "age": 48,
        "gender": "Female",
        "country": "India",
        "state_city": "Bengaluru",
        "primary_condition": "Triple-Negative Breast Cancer",
        "disease_stage": "Stage II",
        "biomarkers": [
            {"marker_name": "ER", "status": "Negative"},
            {"marker_name": "PR", "status": "Negative"},
            {"marker_name": "HER2", "status": "Negative"}
        ],
        "treatments": [{"treatment_name": "Paclitaxel"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR TYPE 2 DIABETES & CKD (NCT05123488)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Dr. Amit Verma",
        "phone_number": "+91 99887 76655",
        "hospital_name": "Apollo Hospitals, Hyderabad",
        "treating_physician": "Dr. Ramesh Nambiar, DM Endocrinology",
        "email": "amit.verma@example.com",
        "age": 62,
        "gender": "Male",
        "country": "India",
        "state_city": "Hyderabad",
        "primary_condition": "Type 2 Diabetes",
        "disease_stage": "Chronic Diabetic Nephropathy",
        "biomarkers": [],
        "treatments": [{"treatment_name": "Metformin"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR HEART FAILURE HFrEF (NCT05400192)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Ananya Rao",
        "phone_number": "+91 97654 32109",
        "hospital_name": "Madras Medical Mission, Chennai",
        "treating_physician": "Dr. K. Srinivas, DM Cardiology",
        "email": "ananya.rao@example.com",
        "age": 68,
        "gender": "Female",
        "country": "India",
        "state_city": "Chennai",
        "primary_condition": "Heart Failure",
        "disease_stage": "NYHA Class III (LVEF 30%)",
        "biomarkers": [],
        "treatments": [{"treatment_name": "Enalapril"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR ALZHEIMER'S DISEASE (NCT05988311)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Suresh Deshmukh",
        "phone_number": "+91 94321 87654",
        "hospital_name": "Kokilaben Dhirubhai Ambani Hospital, Mumbai",
        "treating_physician": "Dr. Rajesh Shah, DM Neurology",
        "email": "suresh.d@example.com",
        "age": 74,
        "gender": "Male",
        "country": "India",
        "state_city": "Mumbai",
        "primary_condition": "Alzheimer's Disease",
        "disease_stage": "Early Stage / MCI",
        "biomarkers": [{"marker_name": "AMYLOID", "status": "Positive"}],
        "treatments": []
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR COLORECTAL CANCER (NCT06101920)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Kavita Reddy",
        "phone_number": "+91 95544 33221",
        "hospital_name": "Tata Memorial Centre, Mumbai",
        "treating_physician": "Dr. Meenakshi Sundaram, MD",
        "email": "kavita.reddy@example.com",
        "age": 52,
        "gender": "Female",
        "country": "India",
        "state_city": "Mumbai",
        "primary_condition": "Colorectal Cancer",
        "disease_stage": "Stage IV",
        "biomarkers": [{"marker_name": "KRAS", "status": "Mutated"}],
        "treatments": [{"treatment_name": "FOLFOX Chemotherapy"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR PROSTATE CANCER (NCT06203310)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Rohan Gupta",
        "phone_number": "+91 93210 98765",
        "hospital_name": "Max Super Speciality Hospital, Saket, New Delhi",
        "treating_physician": "Dr. Alok Nath, DM Urology",
        "email": "rohan.gupta@example.com",
        "age": 65,
        "gender": "Male",
        "country": "India",
        "state_city": "New Delhi",
        "primary_condition": "Prostate Cancer",
        "disease_stage": "mCRPC",
        "biomarkers": [{"marker_name": "PSMA", "status": "Positive"}],
        "treatments": [{"treatment_name": "Abiraterone"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR PARKINSON'S DISEASE (NCT06341280)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Mahesh Bhatia",
        "phone_number": "+91 98334 55667",
        "hospital_name": "NIMHANS Neuro Institute, Bengaluru",
        "treating_physician": "Dr. Pradeep Kumar, DM Neurology",
        "email": "mahesh.bhatia@example.com",
        "age": 59,
        "gender": "Male",
        "country": "India",
        "state_city": "Bengaluru",
        "primary_condition": "Parkinson's Disease",
        "disease_stage": "Early Stage",
        "biomarkers": [{"marker_name": "ALPHA-SYNUCLEIN", "status": "Positive"}],
        "treatments": [{"treatment_name": "Levodopa/Carbidopa"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR COPD (NCT06411290)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Vikram Joshi",
        "phone_number": "+91 99112 23344",
        "hospital_name": "Chest Research Foundation Hospital, Pune",
        "treating_physician": "Dr. Sundeep Salvi, MD Pulmonology",
        "email": "vikram.joshi@example.com",
        "age": 61,
        "gender": "Male",
        "country": "India",
        "state_city": "Pune",
        "primary_condition": "COPD",
        "disease_stage": "Moderate-to-Severe Eosinophilic",
        "biomarkers": [{"marker_name": "EOSINOPHILS", "status": "Positive"}],
        "treatments": [{"treatment_name": "Inhaled Corticosteroids"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR ATOPIC DERMATITIS (NCT06522300)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Aarav Nambiar",
        "phone_number": "+91 98450 66778",
        "hospital_name": "KEM Hospital Dermatology Unit, Mumbai",
        "treating_physician": "Dr. Vidya Iyer, MD Dermatology",
        "email": "aarav.nambiar@example.com",
        "age": 24,
        "gender": "Male",
        "country": "India",
        "state_city": "Mumbai",
        "primary_condition": "Atopic Dermatitis",
        "disease_stage": "Moderate-to-Severe (EASI 22)",
        "biomarkers": [],
        "treatments": [{"treatment_name": "Topical Corticosteroids"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR MELANOMA (NCT06600111)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Deepika Sengupta",
        "phone_number": "+91 97334 88990",
        "hospital_name": "Tata Memorial Centre, Mumbai",
        "treating_physician": "Dr. Boman Dastur, MD Surgical Oncology",
        "email": "deepika.sengupta@example.com",
        "age": 42,
        "gender": "Female",
        "country": "India",
        "state_city": "Mumbai",
        "primary_condition": "Melanoma",
        "disease_stage": "Stage III",
        "biomarkers": [{"marker_name": "BRAF V600E", "status": "Mutated"}],
        "treatments": []
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR CROHN'S DISEASE (NCT06711222)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Nikhil Agarwal",
        "phone_number": "+91 99001 22334",
        "hospital_name": "Gastroenterology Research Center AIIMS, New Delhi",
        "treating_physician": "Dr. Vineet Ahuja, DM Gastroenterology",
        "email": "nikhil.agarwal@example.com",
        "age": 36,
        "gender": "Male",
        "country": "India",
        "state_city": "New Delhi",
        "primary_condition": "Crohn's Disease",
        "disease_stage": "Moderate-to-Severe Active (CDAI 310)",
        "biomarkers": [],
        "treatments": [{"treatment_name": "Infliximab"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR MULTIPLE MYELOMA (NCT06822333)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Tarun Saxena",
        "phone_number": "+91 98112 44556",
        "hospital_name": "ACTREC Tata Memorial Centre, Mumbai",
        "treating_physician": "Dr. Pankaj Malhotra, DM Hematology",
        "email": "tarun.saxena@example.com",
        "age": 64,
        "gender": "Male",
        "country": "India",
        "state_city": "Mumbai",
        "primary_condition": "Multiple Myeloma",
        "disease_stage": "Relapsed / Refractory",
        "biomarkers": [{"marker_name": "BCMA", "status": "Positive"}],
        "treatments": [{"treatment_name": "Bortezomib"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR FSGS NEPHROLOGY (NCT06933444)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Meera Chawla",
        "phone_number": "+91 97445 66778",
        "hospital_name": "CMC Vellore Nephrology Unit, Tamil Nadu",
        "treating_physician": "Dr. George T. John, DM Nephrology",
        "email": "meera.chawla@example.com",
        "age": 29,
        "gender": "Female",
        "country": "India",
        "state_city": "Vellore",
        "primary_condition": "Focal Segmental Glomerulosclerosis",
        "disease_stage": "Primary FSGS with Proteinuria",
        "biomarkers": [],
        "treatments": [{"treatment_name": "ACE Inhibitors"}]
    },

    # ----------------------------------------------------------------------
    # PATIENT TAILORED FOR SYSTEMIC LUPUS ERYTHEMATOSUS (NCT07044555)
    # ----------------------------------------------------------------------
    {
        "patient_name": "Pooja Banerjee",
        "phone_number": "+91 99556 77889",
        "hospital_name": "PGIMER Rheumatology Department, Chandigarh",
        "treating_physician": "Dr. Aman Sharma, DM Rheumatology",
        "email": "pooja.banerjee@example.com",
        "age": 31,
        "gender": "Female",
        "country": "India",
        "state_city": "Chandigarh",
        "primary_condition": "Systemic Lupus Erythematosus",
        "disease_stage": "Active SLE",
        "biomarkers": [
            {"marker_name": "ANA", "status": "Positive"},
            {"marker_name": "ANTI-DSDNA", "status": "Positive"}
        ],
        "treatments": [{"treatment_name": "Hydroxychloroquine"}]
    }
]

def seed_clinical_trials_database(db: Session) -> int:
    count = 0
    for data in SAMPLE_TRIALS:
        existing = db.query(ClinicalTrial).filter(ClinicalTrial.id == data["id"]).first()
        if not existing:
            trial = ClinicalTrial(
                id=data["id"],
                title=data["title"],
                official_title=data.get("official_title"),
                condition=data["condition"],
                brief_summary=data.get("brief_summary"),
                detailed_description=data.get("detailed_description"),
                phase=data["phase"],
                study_type=data.get("study_type", "Interventional"),
                status=data.get("status", "Recruiting"),
                min_age=data.get("min_age", 0),
                max_age=data.get("max_age", 100),
                gender_requirement=data.get("gender_requirement", "All"),
                intervention=data.get("intervention"),
                sponsor=data.get("sponsor"),
                study_start=data.get("study_start"),
                primary_completion=data.get("primary_completion")
            )
            db.add(trial)
            db.flush()

            for loc in data.get("locations", []):
                db.add(TrialLocation(trial_id=trial.id, country=loc["country"], city=loc.get("city"), facility_name=loc.get("facility_name")))

            for crit in data.get("criteria", []):
                db.add(TrialCriteria(trial_id=trial.id, criterion_type=crit["criterion_type"], raw_text=crit["raw_text"], category=crit.get("category", "GENERAL")))

            count += 1

    db.commit()

    # Seed Patient Candidates
    seed_patient_profiles_database(db)
    return count

def seed_patient_profiles_database(db: Session) -> int:
    p_count = 0
    for p_data in SAMPLE_PATIENTS:
        existing = db.query(Patient).filter(Patient.patient_name == p_data["patient_name"]).first()
        if not existing:
            patient = Patient(
                patient_name=p_data["patient_name"],
                phone_number=p_data["phone_number"],
                hospital_name=p_data["hospital_name"],
                treating_physician=p_data["treating_physician"],
                email=p_data["email"],
                age=p_data["age"],
                gender=p_data["gender"],
                country=p_data["country"],
                state_city=p_data["state_city"],
                primary_condition=p_data["primary_condition"],
                disease_stage=p_data["disease_stage"]
            )
            db.add(patient)
            db.flush()

            for bm in p_data.get("biomarkers", []):
                db.add(PatientBiomarker(patient_id=patient.id, marker_name=bm["marker_name"], status=bm["status"]))

            for tr in p_data.get("treatments", []):
                db.add(PatientTreatment(patient_id=patient.id, treatment_name=tr["treatment_name"], treatment_type="prior"))

            p_count += 1

    db.commit()
    return p_count
