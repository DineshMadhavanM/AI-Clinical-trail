# AI / ML Methodology & Mathematical Formulation

## 1. Natural Language Processing (NLP) Entity Extraction
The NLP Extractor (`MedicalNLPExtractor`) transforms unstructured clinical narratives into structured patient parameters:

```text
Unstructured Text ──> Tokenization ──> Regex Pattern Matching ──> Medical Entity Normalization
```

Entities extracted:
- **Demographics**: Age ($\text{age} \in [0, 120]$), Biological Gender ($\text{gender} \in \{\text{Male}, \text{Female}, \text{All}\}$).
- **Disease & Stage**: Primary Condition (e.g. *Non-Small Cell Lung Cancer*), Stage (e.g. *Stage III*, *Metastatic*).
- **Biomarkers**: Marker Name & Status tuple $(m, s)$ where $s \in \{\text{Positive}, \text{Negative}, \text{Mutated}\}$.

---

## 2. Hard Deterministic Rule Evaluation Layer
Evaluates strict eligibility conditions:
1. **Age Requirement**:
   $$\text{Status}_{\text{age}} = \begin{cases} \text{PASS}, & \text{min\_age} \le \text{age} \le \text{max\_age} \\ \text{FAIL}, & \text{otherwise} \end{cases}$$
2. **Gender Requirement**:
   $$\text{Status}_{\text{gender}} = \begin{cases} \text{PASS}, & \text{req} \in \{\text{'All'}, \text{patient\_gender}\} \\ \text{FAIL}, & \text{otherwise} \end{cases}$$
3. **Biomarker Compatibility**:
   Inclusion criteria text is scanned for required biomarker status.

The deterministic rule score $S_{\text{rule}}$ is computed as:
$$S_{\text{rule}} = \frac{\sum \text{Rules}_{\text{passed}}}{\text{Total Rules Evaluated}}$$

---

## 3. Vector Sentence Embedding & Cosine Similarity
Trial protocol descriptions and criteria texts are embedded into dense vector space $\mathbf{v}_{\text{trial}} \in \mathbb{R}^d$ using `sentence-transformers` (`all-MiniLM-L6-v2`) or TF-IDF matrix projection.

For a patient query vector $\mathbf{u}_{\text{patient}} \in \mathbb{R}^d$, semantic similarity $S_{\text{semantic}}$ is computed as:
$$S_{\text{semantic}} = \cos(\mathbf{u}, \mathbf{v}) = \frac{\mathbf{u} \cdot \mathbf{v}}{\|\mathbf{u}\|_2 \|\mathbf{v}\|_2}$$

---

## 4. Hybrid Scoring Formula
The final match score $S_{\text{final}}$ combines five dimensions:
$$S_{\text{final}} = w_{\text{rule}} \cdot S_{\text{rule}} + w_{\text{semantic}} \cdot S_{\text{semantic}} + w_{\text{condition}} \cdot S_{\text{condition}} + w_{\text{location}} \cdot S_{\text{location}} + w_{\text{status}} \cdot S_{\text{status}}$$

Default weights:
- $w_{\text{rule}} = 0.40$
- $w_{\text{semantic}} = 0.30$
- $w_{\text{condition}} = 0.15$
- $w_{\text{location}} = 0.10$
- $w_{\text{status}} = 0.05$

Qualitative status thresholds:
- $S_{\text{final}} \ge 0.78 \implies \text{LIKELY\_MATCH}$
- $0.62 \le S_{\text{final}} < 0.78 \implies \text{POSSIBLE\_MATCH}$
- $0.48 \le S_{\text{final}} < 0.62 \implies \text{NEEDS\_REVIEW}$
- $S_{\text{final}} < 0.48 \implies \text{UNLIKELY\_MATCH}$
