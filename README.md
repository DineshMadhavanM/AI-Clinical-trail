# AI Clinical Trial Matching & Eligibility Assistant 🩺🤖

A full-stack, B.Tech final-year capstone project for clinical trial discovery, eligibility verification, explainable AI matching, and RAG-driven protocol QA.

---

## 🌟 Key Features

1. **Unstructured AI Medical Information Extractor**: Converts free-text clinical notes (e.g. *"55 y/o male with Stage III NSCLC, EGFR positive, prior chemo"*) into structured patient JSON parameters.
2. **Hybrid 5-Factor Explainable AI Matcher**: Combines deterministic hard eligibility rules (age, gender, disease stage, biomarkers, exclusion risks) with vector sentence embeddings (`sentence-transformers`).
3. **Transparent Explainable AI (XAI)**: Displays granular pass/warning/fail factor breakdowns for every trial match.
4. **RAG AI Clinical Assistant**: Interactive chat assistant that answers trial questions grounded directly on protocol document chunks with citations.
5. **Role-Based Workflows**: Tailored interfaces for Patients, Healthcare Professionals / Physicians, and Admins.
6. **Executive Analytics Dashboard**: Interactive charts displaying phase distributions, recruiting protocols, and focus conditions.
7. **Safety & Compliance**: Prominent non-diagnostic research disclaimers across all pages.

---

## 🛠️ Tech Stack

- **Backend**: Python 3.10+, FastAPI, Pydantic v2, SQLAlchemy 2.0 ORM, PyJWT, passlib
- **Database**: SQLite (default local dev) / PostgreSQL compatible
- **AI/ML Engine**: `sentence-transformers` (`all-MiniLM-L6-v2`), FAISS vector store, `scikit-learn`
- **Frontend**: React 18 (TypeScript), Vite, Tailwind CSS, Lucide Icons, Recharts

---

## 🚀 Quick Start & Setup Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to project root
cd "c:\Ai Clinical"

# Install Python dependencies
pip install -r backend/requirements.txt
pip install email-validator

# Run Pytest unit & integration tests
$env:PYTHONPATH="c:\Ai Clinical\backend"; python -m pytest backend/tests

# Run Quantitative AI Evaluation Script
$env:PYTHONPATH="c:\Ai Clinical\backend"; python backend/ai_evaluation.py

# Start FastAPI server
$env:PYTHONPATH="c:\Ai Clinical\backend"; python -m uvicorn app.main:app --reload --port 8000
```
- FastAPI Interactive API Docs: `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
# Navigate to frontend directory
cd "c:\Ai Clinical\frontend"

# Install npm dependencies
npm install

# Start Vite dev server
npm run dev
```
- Open Browser: `http://localhost:5173`

---

## 📊 Quantitative AI Evaluation Results

Ran using `python backend/ai_evaluation.py`:
- **Top-1 Match Retrieval Accuracy**: 100.00%
- **Classification Precision**: 100.00%
- **Classification Recall**: 100.00%
- **F1-Score**: 100.00%

---

## 📁 Project Structure

```
c:\Ai Clinical\
├── backend/
│   ├── app/
│   │   ├── api/v1/ (auth, patients, trials, matching, rag, admin)
│   │   ├── core/ (config, database, security)
│   │   ├── models/ (User, Patient, ClinicalTrial, MatchResult)
│   │   ├── schemas/ (Pydantic DTO schemas)
│   │   ├── services/ (nlp_extractor, rule_evaluator, vector_store, hybrid_matcher, rag_assistant)
│   │   └── main.py
│   ├── data/ (seed_data.py)
│   ├── tests/ (test_rules.py, test_api.py)
│   └── ai_evaluation.py
├── frontend/
│   ├── src/
│   │   ├── components/ (common, patient, trial, matching, assistant)
│   │   ├── pages/ (Dashboard, PatientProfilePage, TrialSearchPage, MatchingPage, TrialDetailPage, AdminPage)
│   │   ├── services/ (api.ts)
│   │   └── types/ (index.ts)
│   ├── package.json
│   └── vite.config.ts
└── docs/
    ├── system_architecture.md
    ├── database_schema.md
    ├── er_diagram.mermaid
    ├── data_flow_diagram.md
    ├── sequence_diagrams.md
    ├── test_cases.md
    ├── ai_ml_methodology.md
    ├── project_report.md
    ├── presentation_deck.md
    └── viva_qa.md
```

---

## ⚠️ Medical Disclaimer
> *"This application is an AI-assisted clinical trial discovery and research tool. Matching results are not medical advice and do not confirm clinical-trial eligibility. Eligibility must be verified against official trial information by the patient and an appropriate healthcare professional or trial coordinator."*
