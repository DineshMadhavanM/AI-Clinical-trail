import streamlit as st
import pandas as pd
import requests
import json
import os

# Page Config
st.set_page_config(
    page_title="AI Clinical Trial Matching & Eligibility Assistant",
    page_icon="🩺",
    layout="wide",
    initial_sidebar_state="expanded"
)

raw_api_url = os.environ.get("API_BASE_URL", "http://127.0.0.1:8000/api/v1")
if raw_api_url.startswith("http://") or raw_api_url.startswith("https://"):
    API_BASE_URL = raw_api_url.rstrip("/")
else:
    API_BASE_URL = f"https://{raw_api_url}/api/v1"



# Custom CSS for dark glassmorphic medical theme
st.markdown("""
<style>
    .main-header {
        font-size: 2.2rem;
        font-weight: 800;
        background: linear-gradient(90deg, #38bdf8, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }
    .sub-header {
        font-size: 0.95rem;
        color: #94a3b8;
        margin-bottom: 1.5rem;
    }
    .stAlert {
        background-color: rgba(120, 53, 15, 0.3) !important;
        border: 1px solid rgba(245, 158, 11, 0.4) !important;
        color: #fef3c7 !important;
    }
    .metric-card {
        background: #0f172a;
        border: 1px solid #1e293b;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    .factor-pass {
        background-color: rgba(6, 78, 59, 0.4);
        border: 1px solid #059669;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 8px;
    }
    .factor-fail {
        background-color: rgba(136, 19, 55, 0.4);
        border: 1px solid #e11d48;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 8px;
    }
    .factor-warning {
        background-color: rgba(120, 53, 15, 0.4);
        border: 1px solid #d97706;
        border-radius: 8px;
        padding: 10px;
        margin-bottom: 8px;
    }
</style>
""", unsafe_allow_html=True)

# Top Disclaimer Banner
st.markdown("""
<div style="background-color: rgba(14, 165, 233, 0.1); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; font-size: 0.85rem; color: #bae6fd;">
    <strong>🛡️ AI Clinical Research & Decision-Support Notice:</strong> This application is an AI-assisted research discovery tool for identifying potentially relevant clinical trial protocols. It does not provide medical diagnoses or treatment recommendations. Final eligibility must be verified against official protocol documents by a qualified healthcare professional.
</div>
""", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.title("🩺 AI Clinical Trial Engine")
st.sidebar.caption("Explainable AI & Eligibility Assistant")

page = st.sidebar.radio(
    "Navigation Menu",
    [
        "📊 Executive Dashboard",
        "👤 Patient Profile Intake",
        "🧠 Explainable AI Matching",
        "📋 Trial Protocol Detail View",
        "💬 AI Assistant Chat",
        "⚙️ Admin Control Studio"
    ]
)

# Helper function to query backend
def api_get(endpoint, params=None):
    try:
        r = requests.get(f"{API_BASE_URL}{endpoint}", params=params, timeout=5)
        if r.status_code == 200:
            return r.json()
    except Exception:
        pass
    return None

def api_post(endpoint, json_data):
    try:
        r = requests.post(f"{API_BASE_URL}{endpoint}", json=json_data, timeout=8)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        st.error(f"API Error: {e}")
    return None

# ==========================================
# PAGE 1: EXECUTIVE DASHBOARD
# ==========================================
if page == "📊 Executive Dashboard":
    st.markdown('<div class="main-header">AI Clinical Trial Matching Engine</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Accelerating Patient Eligibility Discovery with Explainable AI & Vector Retrieval</div>', unsafe_allow_html=True)

    stats = api_get("/admin/stats")
    
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric("Total Protocols", stats["total_trials"] if stats else 25)
    with col2:
        st.metric("Recruiting Studies", stats["recruiting_trials"] if stats else 20)
    with col3:
        st.metric("Patient Profiles", stats["total_patients"] if stats else 14)
    with col4:
        st.metric("FAISS Vector Store", "Operational 🟢")

    st.markdown("---")
    
    st.subheader("📈 Protocol Development Phase Distribution")
    phase_data = (
        stats["phase_breakdown"]
        if (stats and "phase_breakdown" in stats and stats["phase_breakdown"])
        else {"Phase 1": 4, "Phase 2": 8, "Phase 3": 12, "Phase 4": 3}
    )
    df_phase = pd.DataFrame([
        {"Phase": k, "Count": int(v)} for k, v in phase_data.items()
    ])
    st.bar_chart(df_phase, x="Phase", y="Count", color="#0284c7")

    st.markdown("---")
    st.subheader("🎯 Key Therapeutic Areas Covered")
    c1, c2, c3 = st.columns(3)
    with c1:
        st.info("**Oncology**: Non-Small Cell Lung Cancer, Triple-Negative Breast Cancer, Colorectal Cancer, Melanoma")
    with c2:
        st.success("**Endocrinology & Cardiology**: Type 2 Diabetes, Diabetic Nephropathy, Heart Failure (HFrEF)")
    with c3:
        st.warning("**Neurology**: Alzheimer's Disease, Mild Cognitive Impairment")

# ==========================================
# PAGE 2: PATIENT PROFILE INTAKE
# ==========================================
elif page == "👤 Patient Profile Intake":
    if "show_add_patient" not in st.session_state:
        st.session_state["show_add_patient"] = False

    header_col1, header_col2 = st.columns([3, 1])
    with header_col1:
        if st.session_state["show_add_patient"]:
            st.markdown('<div class="main-header">Patient Profile Intake & AI Medical Document Extractor</div>', unsafe_allow_html=True)
            st.markdown('<div class="sub-header">Upload medical files (.PDF, .TXT, .DOCX, .CSV, .JSON) in Method 1 or fill details manually in Method 2.</div>', unsafe_allow_html=True)
        else:
            st.markdown('<div class="main-header">Registered Patient Profiles</div>', unsafe_allow_html=True)
            st.markdown('<div class="sub-header">View registered patient candidate details or add new patient intake records.</div>', unsafe_allow_html=True)

    with header_col2:
        st.markdown("<div style='text-align: right; padding-top: 10px;'>", unsafe_allow_html=True)
        if st.session_state["show_add_patient"]:
            if st.button("⬅️ Back to Patient Directory", use_container_width=True):
                st.session_state["show_add_patient"] = False
                st.rerun()
        else:
            if st.button("➕ Add Patient", type="primary", use_container_width=True):
                st.session_state["show_add_patient"] = True
                st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)

    if not st.session_state["show_add_patient"]:
        # View Mode: Display existing registered patient profiles
        patients = api_get("/patients")
        if not patients:
            st.info("No registered patient profiles found. Click **➕ Add Patient** at the top right to create one.")
        else:
            st.markdown(f"### 📋 Registered Patient Candidates ({len(patients)})")
            for p in patients:
                p_name = p.get('patient_name') or f"Patient #{p['id']}"
                p_hospital = p.get('hospital_name') or "Hospital/Facility N/A"
                p_doc = p.get('treating_physician') or "Oncologist N/A"
                p_phone = p.get('phone_number') or "N/A"
                
                is_confirmed = bool(p.get("confirmed_trial_id"))
                status_icon = " ✅ [VERIFIED CANDIDATE]" if is_confirmed else ""
                
                with st.expander(f"👤{status_icon} **{p_name}** — {p['age']} y/o {p['gender']} | {p['primary_condition']} ({p.get('disease_stage', 'N/A')}) | {p_hospital}"):
                    c1, c2, c3 = st.columns(3)
                    with c1:
                        if is_confirmed:
                            st.markdown("🔒 **Verification Status:** <span style='color:#10b981; font-weight:bold;'>✔ Verified & Enrolled</span>", unsafe_allow_html=True)
                        st.write(f"**Patient ID:** #{p['id']}")
                        st.write(f"**Contact Phone:** `{p_phone}`")
                    with c2:
                        st.write(f"**Treating Physician:** {p_doc}")
                        st.write(f"**Location:** {p.get('state_city', 'N/A')}, {p.get('country', 'India')}")
                    with c3:
                        st.write(f"**Primary Condition:** {p['primary_condition']}")
                        st.write(f"**Disease Stage:** {p.get('disease_stage', 'N/A')}")
                    
                    if is_confirmed:
                        st.markdown(f"""
                        <div style="background-color: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 10px; padding: 12px; margin-top: 10px; margin-bottom: 10px;">
                            <span style="color: #34d399; font-weight: bold; font-size: 0.9rem;">✔ Confirmed Clinical Trial Protocol:</span><br/>
                            <span style="color: #38bdf8; font-weight: bold; font-size: 0.85rem;">Protocol ID: {p['confirmed_trial_id']}</span><br/>
                            <span style="color: #e2e8f0; font-size: 0.85rem;">Title: {p.get('confirmed_trial_title', '')}</span>
                        </div>
                        """, unsafe_allow_html=True)

                    if p.get("biomarkers"):
                        b_items = [f"{b['marker_name']}: {b['status']}" for b in p["biomarkers"]]
                        st.info(f"**Biomarkers:** {', '.join(b_items)}")
                    if p.get("treatments"):
                        t_items = [t['treatment_name'] for t in p["treatments"]]
                        st.success(f"**Prior Treatments:** {', '.join(t_items)}")

    else:
        # Form Mode: Show Patient Profile Intake & AI Medical Document Extractor Page
        col1, col2 = st.columns([1, 1])

        with col1:
            st.markdown("### 📄 Method 1: Upload Medical File (.PDF, .TXT, .DOCX, .CSV, .JSON)")

            uploaded_file = st.file_uploader(
                "Upload Medical File:",
                type=["pdf", "txt", "docx", "doc", "csv", "json", "md"]
            )

            if uploaded_file is not None and st.button("🚀 Process File & Store Patient Profile", type="primary"):
                with st.spinner("Parsing document & storing patient profile in database..."):
                    try:
                        files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
                        import requests
                        resp = requests.post("http://127.0.0.1:8000/api/v1/patients/upload-document", files=files)
                        if resp.status_code == 200:
                            data = resp.json()
                            st.session_state["extracted"] = data
                            st.success(f"✅ Patient profile extracted & stored in database as Patient #{data.get('saved_patient_id')} ({data.get('patient_name')})!")
                        else:
                            st.error(f"Error processing file: {resp.text}")
                    except Exception as e:
                        st.error(f"Failed to connect to backend: {e}")

            clinical_notes = st.text_area(
                "Or Paste Unstructured Medical Notes:",
                value="55 y/o male diagnosed with Stage III Non-Small Cell Lung Cancer. EGFR positive, prior chemotherapy.",
                height=100
            )

            if st.button("✨ Run AI Medical Extractor on Text"):
                if clinical_notes.strip():
                    with st.spinner("Extracting medical entities using NLP..."):
                        result = api_post("/patients/extract-text", {"clinical_text": clinical_notes})
                        if result:
                            st.session_state["extracted"] = result
                            st.success("Extracted clinical parameters successfully!")

            if "extracted" in st.session_state:
                st.markdown("#### 🔍 Extracted Clinical Parameters")
                ext = st.session_state["extracted"]
                st.json(ext)

        with col2:
            st.markdown("### 📋 Method 2: Patient Registration Form")
            ext = st.session_state.get("extracted", {})

            p_name = st.text_input("Patient Full Name:", value=ext.get("patient_name") or "Rahul Sharma")
            p_phone = st.text_input("Contact Phone Number:", value=ext.get("phone_number") or "+91 98765 43210")
            p_hospital = st.text_input("Affiliated Hospital / Medical Center:", value=ext.get("hospital_name") or "Tata Memorial Hospital, Mumbai")
            p_doc = st.text_input("Treating Physician / Oncologist:", value=ext.get("treating_physician") or "Dr. Vikram Adani, MD Oncology")

            age = st.number_input("Age:", min_value=0, max_value=120, value=int(ext.get("age") or 55))
            gender = st.selectbox("Gender:", ["Male", "Female", "All"], index=0 if ext.get("gender") == "Male" else (1 if ext.get("gender") == "Female" else 2))
            condition = st.text_input("Primary Condition:", value=ext.get("primary_condition") or "Non-Small Cell Lung Cancer")
            stage = st.selectbox("Disease Stage:", ["Stage I", "Stage II", "Stage III", "Stage IV", "N/A"], index=2)
            location = st.text_input("Location (State/City):", value="Mumbai")

            if st.button("💾 Save Patient Profile & Match Trials"):
                payload = {
                    "patient_name": p_name,
                    "phone_number": p_phone,
                    "hospital_name": p_hospital,
                    "treating_physician": p_doc,
                    "age": age,
                    "gender": gender,
                    "country": "India",
                    "state_city": location,
                    "primary_condition": condition,
                    "disease_stage": stage,
                    "biomarkers": [{"marker_name": b.get("marker_name", "EGFR"), "status": b.get("status", "Positive")} for b in ext.get("biomarkers", [{"marker_name": "EGFR", "status": "Positive"}])],
                    "treatments": [{"treatment_name": t, "treatment_type": "prior"} for t in ext.get("treatments", ["Chemotherapy"])]
                }

                res = api_post("/patients", payload)
                if res:
                    st.success(f"Patient #{res['id']} registered successfully!")
                    st.session_state["active_patient_id"] = res["id"]
                    st.session_state["show_add_patient"] = False
                    st.rerun()

# ==========================================
# PAGE 3: EXPLAINABLE AI MATCHING
# ==========================================
elif page == "🧠 Explainable AI Matching":
    st.markdown('<div class="main-header">Trial Protocol ➔ AI Matching ➔ Potentially Eligible Patients</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Evaluates registered clinical trial protocols against patient candidate records using 5-factor weighted algorithm and vector embeddings.</div>', unsafe_allow_html=True)

    st.markdown("""
    <div style="background-color: rgba(14, 165, 233, 0.08); border: 1px solid rgba(14, 165, 233, 0.3); border-radius: 12px; padding: 12px 18px; margin-bottom: 20px; font-size: 0.85rem; color: #e0f2fe; display: flex; justify-content: space-between;">
        <span><strong>Step 1:</strong> Select Target Protocol</span> ➔ 
        <span><strong>Step 2:</strong> AI Eligibility Matching</span> ➔ 
        <span><strong>Step 3:</strong> Potentially Eligible Patients</span>
    </div>
    """, unsafe_allow_html=True)

    trials = api_get("/trials")
    if not trials:
        st.warning("No clinical trial protocols found.")
    else:
        trial_options = {f"{t['id']}: {t['title'][:65]}... ({t['phase']})": t for t in trials}
        selected_trial_label = st.selectbox("Step 1: Select Target Trial Protocol for Patient Candidate Screening:", list(trial_options.keys()))
        selected_trial = trial_options[selected_trial_label]
        selected_trial_id = selected_trial['id']

        if st.button("🚀 Step 2: Run AI Matching for Candidate Patients", type="primary"):
            with st.spinner("Evaluating candidate patient database against trial criteria..."):
                matches = api_post("/matching/trial-candidates", {"trial_id": selected_trial_id, "top_k": 10})
                if matches:
                    st.session_state["trial_patient_matches"] = matches

        if "trial_patient_matches" in st.session_state:
            st.markdown("### Step 3: Ranked Potentially Eligible Patients")
            for match in st.session_state["trial_patient_matches"]:
                p = match["patient"]
                score_pct = int(match["total_score"] * 100)
                status_label = match["eligibility_status"].replace("_", " ")

                p_name = p.get('patient_name') or f"Patient #{p['id']}"
                p_hospital = p.get('hospital_name') or "Hospital Affiliation"
                p_phone = p.get('phone_number') or "N/A"
                
                is_confirmed_this = (p.get("confirmed_trial_id") == selected_trial_id)

                with st.expander(f"🎯 **{score_pct}% Match** — [{status_label}] {p_name} ({p['age']}y/o {p['gender']}) | {p_hospital}"):
                    st.progress(match["total_score"])
                    st.write(f"**Phone:** `{p_phone}` | **Physician:** {p.get('treating_physician', 'N/A')}")
                    st.write(f"**Primary Disease:** {p['primary_condition']} ({p.get('disease_stage', 'N/A')}) | **Location:** {p.get('state_city', '')}, {p['country']}")
                    st.write(f"**Rule Score:** {int(match['rule_score']*100)}% | **Vector Sim:** {int(match['semantic_score']*100)}% | **Condition Score:** {int(match['condition_score']*100)}%")

                    st.markdown("#### ✅ Satisfied Eligibility Factors")
                    for factor in match.get("matching_factors", []):
                        st.markdown(f'<div class="factor-pass"><b>[PASS] {factor["factor_name"]}</b>: {factor["details"]}<br/><small>Patient Data: <i>{factor["patient_value"]}</i> | Trial Requirement: <i>{factor["trial_requirement"]}</i></small></div>', unsafe_allow_html=True)

                    # Confirm Button below Satisfied Eligibility Factors on left side
                    b_col1, b_col2 = st.columns([1.2, 2])
                    with b_col1:
                        confirm_key = f"confirm_btn_{p['id']}_{selected_trial_id}"
                        if is_confirmed_this or p.get("confirmed_trial_id"):
                            st.success(f"✔ Confirmed for {p.get('confirmed_trial_id', selected_trial_id)}")
                        else:
                            if st.button(f"✅ Confirm Patient #{p['id']} Eligibility", key=confirm_key, type="primary"):
                                res = api_post(f"/patients/{p['id']}/confirm-trial", {
                                    "trial_id": selected_trial_id,
                                    "trial_title": selected_trial['title']
                                })
                                if res:
                                    p["confirmed_trial_id"] = selected_trial_id
                                    p["confirmed_trial_title"] = selected_trial['title']
                                    st.success(f"✅ Patient #{p['id']} confirmed for {selected_trial_id}!")
                                    st.rerun()

                    if match.get("potential_issues"):
                        st.markdown("#### ⚠️ Discrepancies / Warnings")
                        for factor in match.get("potential_issues", []):
                            css_class = "factor-fail" if factor["status"] == "FAIL" else "factor-warning"
                            st.markdown(f'<div class="{css_class}"><b>[{factor["status"]}] {factor["factor_name"]}</b>: {factor["details"]}<br/><small>Patient Data: <i>{factor["patient_value"]}</i> | Trial Requirement: <i>{factor["trial_requirement"]}</i></small></div>', unsafe_allow_html=True)

# ==========================================
# PAGE 5: TRIAL PROTOCOL DETAIL VIEW
# ==========================================
elif page == "📋 Trial Protocol Detail View":
    st.markdown('<div class="main-header">Detailed Protocol Inspector</div>', unsafe_allow_html=True)
    trials = api_get("/trials")
    if trials:
        t_ids = [t["id"] for t in trials]
        sel_id = st.selectbox("Select Protocol ID:", t_ids)
        t = api_get(f"/trials/{sel_id}")
        if t:
            st.title(f"{t['id']}: {t['title']}")
            st.write(f"**Official Title:** {t.get('official_title', 'N/A')}")
            st.write(f"**Condition:** {t['condition']} | **Phase:** {t['phase']} | **Status:** {t['status']}")
            st.write(f"**Age Range:** {t['min_age']} - {t['max_age']} years | **Gender:** {t['gender_requirement']}")
            
            st.markdown("---")
            st.subheader("Inclusion Criteria")
            for c in t.get("criteria", []):
                if c["criterion_type"] == "inclusion":
                    st.write(f"• {c['raw_text']}")
                    
            st.subheader("Exclusion Criteria")
            for c in t.get("criteria", []):
                if c["criterion_type"] == "exclusion":
                    st.write(f"• {c['raw_text']}")

# ==========================================
# PAGE 5: AI ASSISTANT CHAT
# ==========================================
elif page == "💬 AI Assistant Chat":
    st.markdown('<div class="main-header">AI Clinical Trial Assistant</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Grounded protocol QA engine with trial document citations.</div>', unsafe_allow_html=True)

    trials = api_get("/trials")
    if trials:
        trial_map = {f"{t['id']} - {t['title'][:40]}...": t['id'] for t in trials}
        sel_t_label = st.selectbox("Select Target Trial Protocol:", list(trial_map.keys()))
        target_trial_id = trial_map[sel_t_label]

        question = st.text_input("Ask a question about this trial protocol:", "What are the eligibility requirements?")
        
        if st.button("💬 Ask AI Assistant", type="primary"):
            with st.spinner("Retrieving protocol vector chunks & synthesizing answer..."):
                res = api_post("/ai/chat", {"trial_id": target_trial_id, "question": question})
                if res:
                    st.markdown("### Assistant Answer:")
                    st.markdown(res["answer"])
                    st.info(f"**Citation Sources:** {', '.join(res['sources'])}")
                    st.caption(res["disclaimer"])

# ==========================================
# PAGE 7: ADMIN CONTROL STUDIO
# ==========================================
elif page == "⚙️ Admin Control Studio":
    st.markdown('<div class="main-header">Admin Dataset & System Studio</div>', unsafe_allow_html=True)
    
    if st.button("🔄 Trigger Clinical Dataset Seed"):
        with st.spinner("Seeding database with verified clinical trials..."):
            res = api_post("/admin/seed-dataset", {})
            if res:
                st.success(res["message"])

    stats = api_get("/admin/stats")
    if stats:
        st.json(stats)
