# System Architecture: AI Clinical Trial Matching & Eligibility Assistant

## 1. High-Level Architectural Flow

```
 ┌─────────────────────────────────────────────────────────┐
 │                React + TypeScript Frontend              │
 │  (Dashboard, Patient Profile, Trial Search, XAI Modal)  │
 └────────────────────────────┬────────────────────────────┘
                              │ REST API (JSON / HTTP)
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │                     FastAPI Backend                     │
 │          (Router, Controllers, Security, Pydantic)      │
 └──────┬─────────────────────┬─────────────────────┬──────┘
        │                     │                     │
        ▼                     ▼                     ▼
 ┌──────────────┐     ┌──────────────┐      ┌──────────────┐
 │  SQLAlchemy  │     │ AI Matching  │      │ RAG Assistant│
 │  ORM Engine  │     │   Engine     │      │   Service    │
 └──────┬───────┘     └──────┬───────┘      └──────┬───────┘
        │                    │                     │
        ▼                    ▼                     ▼
 ┌──────────────┐     ┌──────────────┐      ┌──────────────┐
 │ SQLite / Postgres  │ Sentence-    │      │ FAISS / Cosine│
 │  Database    │     │ Transformers │      │ Vector Store │
 └──────────────┘     └──────────────┘      └──────────────┘
```

## 2. Core Service Components

### A. NLP Medical Information Extractor (`app.services.nlp_extractor`)
- Receives unstructured clinical text narratives (e.g. *"55 y/o male with Stage III NSCLC, prior chemo, EGFR positive"*).
- Applies medical regex pattern recognizers and terminology canonicalization.
- Returns structured JSON containing age, gender, condition, stage, biomarkers, and treatments with confidence scoring.

### B. Hard Eligibility Rule Evaluator (`app.services.rule_evaluator`)
- Deterministic matching layer checking:
  - Age bounds ($min\_age \le patient.age \le max\_age$)
  - Gender eligibility constraint
  - Primary disease condition substring/synonym alignment
  - Biomarker positive/negative/mutation compatibility
  - Exclusion criteria detection against patient comorbidities
- Generates structured Explainable AI (XAI) factors with `PASS`, `WARNING`, and `FAIL` statuses.

### C. Semantic Vector Engine (`app.services.vector_store`)
- Embeds clinical trial titles, descriptions, and criteria texts into vector representations using `sentence-transformers` (`all-MiniLM-L6-v2`) or TF-IDF matrix fallback.
- Computes cosine similarity scores between patient profile embeddings and trial text vectors.

### D. Hybrid Matcher (`app.services.hybrid_matcher`)
- Merges rule evaluation and semantic vectors using a 5-factor weighted algorithm:
  $$ \text{Final Score} = 0.40 \cdot S_{\text{rule}} + 0.30 \cdot S_{\text{semantic}} + 0.15 \cdot S_{\text{condition}} + 0.10 \cdot S_{\text{location}} + 0.05 \cdot S_{\text{status}} $$
- Categorizes trials into qualitative labels: `LIKELY_MATCH`, `POSSIBLE_MATCH`, `NEEDS_REVIEW`, `UNLIKELY_MATCH`.

### E. RAG Trial Assistant (`app.services.rag_assistant`)
- Contextual QA engine that retrieves relevant trial document chunks and synthesizes grounded answers with protocol citations and anti-hallucination medical disclaimers.
