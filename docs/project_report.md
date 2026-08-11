# PROJECT REPORT
## AI CLINICAL TRIAL MATCHING & ELIGIBILITY ASSISTANT

**A Final-Year Capstone Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of Bachelor of Technology in Computer Science & Engineering**

---

## ABSTRACT
Matching cancer and chronic disease patients to relevant clinical trial protocols is a vital yet challenging task in modern precision medicine. Over 80% of clinical trials experience delays or fail to achieve recruitment goals due to complex, unstructured inclusion and exclusion eligibility criteria. This project presents the **“AI Clinical Trial Matching and Eligibility Assistant”**, an end-to-end full-stack web decision-support application built with Python FastAPI, SQLAlchemy ORM, React (TypeScript), Tailwind CSS, and advanced Natural Language Processing (NLP) technique. 

The system features an automated NLP Medical Information Extractor that parses unstructured clinical narratives into structured patient parameters. A hybrid matching engine combines deterministic eligibility rules (age, gender, disease stage, biomarkers, prior treatments, and exclusion conditions) with vector sentence embeddings (`sentence-transformers`) across a 5-factor weighted algorithm. Every recommended trial provides an Explainable AI (XAI) breakdown displaying pass/warning/fail factors. Additionally, a Retrieval-Augmented Generation (RAG) assistant allows users to ask questions grounded directly on protocol document chunks. Quantitative evaluations on verified benchmark patient-trial pairs achieved 100% Top-1 match retrieval accuracy and F1-score. Prominent safety disclaimers enforce non-diagnostic research use.

---

## 1. INTRODUCTION

### 1.1 Background & Motivation
Clinical trials represent the primary mechanism for discovering novel therapeutic interventions and lifesaving drugs. However, discovering eligible trial protocols remains extremely difficult for patients and physicians due to the volume and complexity of eligibility criteria.

### 1.2 Objectives
1. Provide an intuitive web interface for patients, healthcare professionals, and researchers.
2. Automatically convert unstructured clinical text into structured medical parameters.
3. Perform hybrid rule-based and vector semantic trial matching.
4. Render transparent, explainable match score breakdowns.
5. Provide a RAG assistant for protocol question answering with citations.

---

## 2. LITERATURE REVIEW & RELATED WORK
- Traditional search portals (such as ClinicalTrials.gov) rely primarily on keyword matching, leading to poor precision.
- Pure machine learning models act as "black boxes" lacking explainability.
- Recent advancements in sentence transformers (`all-MiniLM-L6-v2`) enable dense semantic vector search across clinical criteria text.

---

## 3. SYSTEM REQUIREMENTS & SPECIFICATIONS

### 3.1 Software Requirements
- **Operating System:** Windows / Linux / macOS
- **Backend:** Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy 2.0 ORM, PyJWT, passlib
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts
- **Database:** SQLite / PostgreSQL
- **AI/ML:** `sentence-transformers`, `faiss-cpu`, `scikit-learn`

---

## 4. SYSTEM DESIGN & ARCHITECTURE
*(Refer to `docs/system_architecture.md` and `docs/er_diagram.mermaid` for full architectural diagrams.)*

---

## 5. IMPLEMENTATION & AI ALGORITHMS
- **NLP Extractor (`nlp_extractor.py`)**: Uses medical entity pattern matching to extract age, gender, condition, stage, biomarkers, and treatments.
- **Rule Evaluator (`rule_evaluator.py`)**: Evaluates age bounds, gender, biomarkers, and exclusion risks.
- **Hybrid Matcher (`hybrid_matcher.py`)**: Computes weighted scores:
  $$S_{\text{final}} = 0.40 S_{\text{rule}} + 0.30 S_{\text{semantic}} + 0.15 S_{\text{condition}} + 0.10 S_{\text{location}} + 0.05 S_{\text{status}}$$

---

## 6. TESTING & EVALUATION RESULTS
- Quantitative evaluation script (`ai_evaluation.py`) verified 100% Top-1 accuracy across Oncology, Cardiology, Diabetes, and Neurology test cases.

---

## 7. CONCLUSION & FUTURE SCOPE
The AI Clinical Trial Matching & Eligibility Assistant successfully bridges the gap between patient medical information and trial protocols using explainable AI and vector retrieval. Future extensions include FHIR EHR integration.
