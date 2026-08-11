from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Clinical Trial Matching & Eligibility Assistant"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "ai_clinical_trial_super_secret_jwt_key_2026_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./clinical_trials.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]
    
    # Matching Weights
    WEIGHT_ELIGIBILITY: float = 0.40
    WEIGHT_SEMANTIC: float = 0.30
    WEIGHT_CONDITION: float = 0.15
    WEIGHT_LOCATION: float = 0.10
    WEIGHT_STATUS: float = 0.05
    
    class Config:
        case_sensitive = True

settings = Settings()
