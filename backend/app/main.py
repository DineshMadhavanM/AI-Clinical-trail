from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.api.v1.router import api_v1_router
from data.seed_data import seed_clinical_trials_database

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="""
    ## AI Clinical Trial Matching & Eligibility Assistant API
    
    **CRITICAL MEDICAL DISCLAIMER:**
    This application is an AI-assisted clinical trial discovery and research tool. 
    Matching results are not medical advice and do not confirm clinical-trial eligibility. 
    Eligibility must be verified against official trial information by the patient and 
    an appropriate healthcare professional or trial coordinator.
    """,
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    logger.info("Initializing database tables and clinical dataset seed...")
    db = SessionLocal()
    try:
        seed_clinical_trials_database(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "title": settings.PROJECT_NAME,
        "status": "Active / Running",
        "docs_url": "/docs",
        "disclaimer": "This application is an AI research tool and not a medical diagnosis or treatment recommendation."
    }
