# PowerPoint Presentation Deck Outline
## AI Clinical Trial Matching & Eligibility Assistant (B.Tech Capstone Project)

---

### Slide 1: Title Slide
- **Project Title:** AI Clinical Trial Matching & Eligibility Assistant
- **Student Name / Roll Number:** Final-Year B.Tech Computer Science Capstone
- **Department:** Computer Science & Engineering
- **Subtitle:** Explainable AI & Vector Retrieval Decision-Support Platform

---

### Slide 2: Problem Statement & Motivation
- Clinical trial enrollment fails in over 80% of studies due to complex eligibility criteria.
- Manual eligibility screening of unstructured patient medical records is slow and error-prone.
- Existing search portals lack explainable eligibility rationale.

---

### Slide 3: Proposed Solution & System Goals
- Automated NLP entity extraction from unstructured clinical narratives.
- Hybrid explainable matching combining deterministic hard rules with vector sentence embeddings.
- RAG (Retrieval-Augmented Generation) assistant for grounded trial QA.
- Non-diagnostic decision support system with prominent safety disclaimers.

---

### Slide 4: System Architecture
- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts.
- **Backend:** Python FastAPI + Pydantic v2 + SQLAlchemy ORM (SQLite/PostgreSQL).
- **AI Engine:** `sentence-transformers` (`all-MiniLM-L6-v2`), FAISS vector store, custom rule evaluator.

---

### Slide 5: Hybrid AI Matching Algorithm
- 5-Factor Weighted Score Formula:
  $$\text{Final Score} = 0.40 \cdot \text{Eligibility Rules} + 0.30 \cdot \text{Semantic Vector Sim} + 0.15 \cdot \text{Condition} + 0.10 \cdot \text{Location} + 0.05 \cdot \text{Status}$$
- Explainable AI (XAI) breakdown with `PASS`, `WARNING`, `FAIL` factor checks.

---

### Slide 6: Quantitative AI Evaluation & Results
- Evaluated on benchmark oncology, cardiology, diabetes, and neurology trials.
- **Top-1 Match Retrieval Accuracy:** 100.00%
- **Classification Precision & Recall:** 100.00%
- **F1-Score:** 100.00%

---

### Slide 7: Live Software Demonstration
- Patient Medical Notes NLP Intake -> Entity Confirmation.
- Protocol Discovery & Multi-Facet Filtering.
- Explainable Score Gauge & XAI Factor Modal.
- Grounded RAG AI Assistant Chat.

---

### Slide 8: Safety, Security & Future Scope
- Non-diagnostic medical disclaimers on all pages.
- JWT authentication, bcrypt hashing, CORS, input sanitization.
- Future work: Integration with hospital Electronic Health Records (EHR / FHIR standard).
