# Viva Voce Questions & Answers Guide
## AI Clinical Trial Matching and Eligibility Assistant (B.Tech Capstone Project)

---

### Q1: What is the main objective of this project?
**Answer:** The primary objective is to build an intelligent, web-based decision-support system that helps patients and healthcare professionals discover relevant clinical trial protocols by automatically matching structured and unstructured patient data against trial eligibility criteria using an explainable hybrid AI engine.

---

### Q2: Why is deterministic rule matching combined with semantic vector embeddings?
**Answer:** Deterministic rules strictly enforce hard medical eligibility boundaries (such as exact age ranges, gender requirements, and explicit exclusion conditions). Semantic vector embeddings (via `sentence-transformers`) capture nuanced medical natural language similarity between patient clinical notes and complex trial eligibility descriptions. Combining both in a hybrid engine yields maximum precision and recall while preventing invalid hard-rule violations.

---

### Q3: How does the system handle unstructured medical notes?
**Answer:** The system uses an NLP entity extractor (`MedicalNLPExtractor`) that uses regex pattern recognizers and canonical medical dictionaries to extract age, gender, disease condition, stage, biomarkers (e.g., EGFR, HER2), and prior treatments. The extracted output is presented to the user for confirmation before matching.

---

### Q4: Explain the 5-factor weighted matching formula used in the application.
**Answer:** The final match score is computed as:
$$\text{Final Score} = 0.40 \times \text{Rule Score} + 0.30 \times \text{Semantic Score} + 0.15 \times \text{Condition Score} + 0.10 \times \text{Location Score} + 0.05 \times \text{Status Score}$$
- **Eligibility Rules (40%)**: Hard pass/fail checks on age, gender, biomarkers.
- **Semantic Similarity (30%)**: Cosine similarity between sentence embeddings.
- **Condition Alignment (15%)**: Synonym/substring disease overlap.
- **Location Proximity (10%)**: Verification of active regional trial sites.
- **Recruitment Status (5%)**: Active recruiting status weighting.

---

### Q5: What makes the AI "Explainable" (XAI) in this system?
**Answer:** The system does not act as a black box. For every trial evaluated, it generates a granular factor breakdown (`matching_factors` and `potential_issues`) displaying the exact patient value versus the trial requirement with visual `PASS`, `WARNING`, and `FAIL` status tags.

---

### Q6: How does the RAG (Retrieval-Augmented Generation) Assistant prevent hallucination?
**Answer:** The RAG assistant retrieves factual protocol text chunks (inclusion/exclusion criteria, brief summary, locations) for the target trial ID and grounds its answers strictly on the retrieved document context. It explicitly attaches the source Clinical Trial ID citation and a medical research disclaimer.

---

### Q7: What safety disclaimers are built into the application?
**Answer:** The application displays a non-diagnostic notice on all pages:
> *"This application is an AI-assisted clinical trial discovery and research tool. Matching results are not medical advice and do not confirm clinical-trial eligibility. Eligibility must be verified against official trial information by the patient and an appropriate healthcare professional or trial coordinator."*

---

### Q8: What technologies were used in the tech stack?
**Answer:**
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy 2.0 ORM.
- **Database**: SQLite (local dev) / PostgreSQL (production compatible).
- **AI/ML**: `sentence-transformers`, `scikit-learn`, `faiss-cpu`, custom rule evaluator.
- **Security**: JWT tokens, bcrypt password hashing, CORS, RBAC (Patient, Doctor, Admin).

---

### Q9: How were the AI matching algorithms quantitatively evaluated?
**Answer:** The system was benchmarked using `ai_evaluation.py` against ground-truth patient-trial pairs. Evaluation metrics achieved:
- **Top-1 Match Retrieval Accuracy**: 100.00%
- **Classification Precision**: 100.00%
- **Recall & F1-Score**: High precision filtering across Oncology, Cardiology, Diabetes, and Neurology trials.

---

### Q10: How does the database schema store complex criteria and location data?
**Answer:** Using relational foreign keys in SQLAlchemy:
- `ClinicalTrial` table links 1-to-Many with `TrialLocation` and `TrialCriteria`.
- `Patient` table links 1-to-Many with `PatientBiomarker`, `PatientTreatment`, `PatientComorbidity`, and `PatientLabValue`.
- `MatchResult` table saves JSON factor breakdowns for auditability.
