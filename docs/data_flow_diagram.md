# Data Flow Diagrams (DFD)
## AI Clinical Trial Matching & Eligibility Assistant

---

## 1. DFD Level 0 (Context Diagram)

```
                       ┌─────────────────────────┐
                       │     Patient User        │
                       └────────────┬────────────┘
                                    │ Patient Medical Text / Structured Profile
                                    ▼
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│         AI CLINICAL TRIAL MATCHING & ELIGIBILITY SYSTEM               │
│                                                                       │
└───────────────────────────────────┬───────────────────────────────────┘
                                    │ Ranked Trial Recommendations & XAI Factor Breakdown
                                    ▼
                       ┌─────────────────────────┐
                       │ Healthcare Professional │
                       └─────────────────────────┘
```

---

## 2. DFD Level 1 (Process Decomposition)

```
  Patient Input
        │
        ▼
 ┌──────────────┐         ┌──────────────┐
 │  Process 1:  │ ──────> │  Patient     │
 │ Medical NLP  │         │ Data Store   │
 │ Entity Ext.  │         └──────┬───────┘
 └──────────────┘                │
                                 ▼
                          ┌──────────────┐
                          │  Process 2:  │ <────── ┌──────────────┐
                          │  Hybrid AI   │         │ Clinical     │
                          │   Matcher    │ <────── │ Trial Store  │
                          └──────┬───────┘         └──────────────┘
                                 │
                                 ▼
                          ┌──────────────┐
                          │  Process 3:  │
                          │ Explainable  │
                          │ AI Generator │
                          └──────┬───────┘
                                 │
                                 ▼
                            Matched Trials +
                           Factor Breakdown
```

---

## 3. DFD Level 2 (Hybrid Matching Sub-Process)

```
Patient Profile ──> [1. Hard Rule Evaluator] ──> Rule Score (40%) ──┐
                                                                    │
Patient Notes   ──> [2. Vector Embedding Engine] ─> Semantic Score (30%) ─┼─> [Weighted Score Sum] ──> Ranked Results
                                                                    │
Trial Condition ──> [3. Condition Alignment] ───> Condition Score (15%) ┘
```
