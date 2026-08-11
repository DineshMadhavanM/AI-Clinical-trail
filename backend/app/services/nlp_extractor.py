import re
from typing import Dict, Any, List
from app.schemas.patient import ExtractedPatientData

class MedicalNLPExtractor:
    """
    Extracts structured clinical information from unstructured patient narratives
    using medical term patterns and rule-based NLP extraction.
    """

    def __init__(self):
        # Common conditions mapping
        self.condition_keywords = {
            "lung cancer": "Lung Cancer",
            "non-small cell lung cancer": "Non-Small Cell Lung Cancer",
            "nsclc": "Non-Small Cell Lung Cancer",
            "breast cancer": "Breast Cancer",
            "triple-negative breast cancer": "Triple-Negative Breast Cancer",
            "colorectal cancer": "Colorectal Cancer",
            "colon cancer": "Colorectal Cancer",
            "prostate cancer": "Prostate Cancer",
            "melanoma": "Melanoma",
            "type 2 diabetes": "Type 2 Diabetes",
            "diabetes": "Type 2 Diabetes",
            "heart failure": "Heart Failure",
            "hypertension": "Hypertension",
            "alzheimer": "Alzheimer's Disease",
            "asthma": "Asthma"
        }

        # Biomarker patterns
        self.biomarker_patterns = [
            (r'egfr[\s\-_]*(positive|\+|\-)', 'EGFR'),
            (r'her2[\s\-_]*(positive|\+|\-|overexpressed)', 'HER2'),
            (r'pd\-?l1[\s\-_]*(positive|\+|\-|high)', 'PD-L1'),
            (r'brca1?[\s\-_]*(positive|\+|\-|\bmutated\b)', 'BRCA1'),
            (r'brca2?[\s\-_]*(positive|\+|\-|\bmutated\b)', 'BRCA2'),
            (r'kras[\s\-_]*(wild[\s\-]*type|mutated|positive)', 'KRAS'),
            (r'alk[\s\-_]*(positive|\+|\-|\brearranged\b)', 'ALK'),
            (r'braf[\s\-_]*(positive|\+|\-|v600e)', 'BRAF'),
        ]

        # Prior treatment keywords
        self.treatment_keywords = [
            "chemotherapy", "radiation", "radiotherapy", "immunotherapy",
            "surgery", "resection", "pembrolizumab", "cisplatin", "paclitaxel",
            "metformin", "insulin", "beta blocker", "ace inhibitor"
        ]

        # Comorbidities
        self.comorbidity_keywords = [
            "hypertension", "high blood pressure", "diabetes", "ckd",
            "chronic kidney disease", "copd", "asthma", "heart disease"
        ]

    def extract(self, text: str) -> ExtractedPatientData:
        lower_text = text.lower()

        # 1. Age extraction
        age = None
        age_match = re.search(r'\b(\d{1,3})[\s\-]*(?:year[s]?[\s\-]*old|yo|y/o|years of age)\b', lower_text)
        if not age_match:
            age_match = re.search(r'\bage[d]?[\s:]*(\d{1,3})\b', lower_text)
        if age_match:
            age = int(age_match.group(1))

        # 2. Gender extraction
        gender = None
        if re.search(r'\b(male|man|boy)\b', lower_text):
            gender = "Male"
        elif re.search(r'\b(female|woman|girl)\b', lower_text):
            gender = "Female"

        # 3. Condition extraction
        primary_condition = None
        for kw, canonical in self.condition_keywords.items():
            if kw in lower_text:
                primary_condition = canonical
                break
        if not primary_condition and "cancer" in lower_text:
            primary_condition = "Cancer"

        # 4. Disease Stage extraction
        disease_stage = None
        stage_match = re.search(r'stage\s*([ivx]+|\d+)', lower_text)
        if stage_match:
            st = stage_match.group(1).upper()
            if st in ["1", "I"]: disease_stage = "Stage I"
            elif st in ["2", "II"]: disease_stage = "Stage II"
            elif st in ["3", "III"]: disease_stage = "Stage III"
            elif st in ["4", "IV"]: disease_stage = "Stage IV"
            else: disease_stage = f"Stage {st}"
        elif "metastatic" in lower_text:
            disease_stage = "Stage IV / Metastatic"

        # 5. Biomarkers extraction
        biomarkers = []
        for pattern, marker_name in self.biomarker_patterns:
            bm_match = re.search(pattern, lower_text)
            if bm_match:
                status_raw = bm_match.group(1) if len(bm_match.groups()) > 0 else "positive"
                status = "Positive"
                if "-" in status_raw or "neg" in status_raw:
                    status = "Negative"
                elif "mutat" in status_raw:
                    status = "Mutated"
                biomarkers.append({"marker_name": marker_name, "status": status})

        # 6. Treatments extraction
        treatments = []
        for tr in self.treatment_keywords:
            if tr in lower_text:
                treatments.append(tr.capitalize())

        # 7. Comorbidities extraction
        comorbidities = []
        for cm in self.comorbidity_keywords:
            if cm in lower_text:
                comorbidities.append(cm.capitalize())

        return ExtractedPatientData(
            age=age,
            gender=gender,
            primary_condition=primary_condition or "Unspecified",
            disease_stage=disease_stage,
            biomarkers=biomarkers,
            treatments=treatments,
            comorbidities=comorbidities,
            confidence_score=0.92 if (age and gender and primary_condition) else 0.75
        )

nlp_extractor = MedicalNLPExtractor()
