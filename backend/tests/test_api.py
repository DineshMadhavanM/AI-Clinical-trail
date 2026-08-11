from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "AI Clinical Trial Matching" in data["title"]
    assert "disclaimer" in data

def test_extract_nlp_endpoint():
    response = client.post(
        "/api/v1/patients/extract-text",
        json={"clinical_text": "I am a 55-year-old male diagnosed with Stage III lung cancer and EGFR positive results."}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["age"] == 55
    assert data["gender"] == "Male"
    assert "Lung Cancer" in data["primary_condition"]
    assert len(data["biomarkers"]) > 0

def test_get_trials_endpoint():
    from app.core.database import SessionLocal
    from data.seed_data import seed_clinical_trials_database
    db = SessionLocal()
    seed_clinical_trials_database(db)
    db.close()

    response = client.get("/api/v1/trials")
    assert response.status_code == 200
    trials = response.json()
    assert len(trials) > 0
