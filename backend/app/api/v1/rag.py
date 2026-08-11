from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.matching import RAGQueryInput, RAGQueryResponse
from app.services.rag_assistant import rag_assistant

router = APIRouter(prefix="/ai", tags=["RAG Assistant"])

@router.post("/chat", response_model=RAGQueryResponse)
def query_rag_assistant(input_data: RAGQueryInput, db: Session = Depends(get_db)):
    """
    RAG Trial Assistant chat endpoint.
    Answers patient or physician questions grounded on retrieved clinical trial documents.
    """
    if not input_data.question or len(input_data.question.strip()) == 0:
        raise HTTPException(status_code=400, detail="Question cannot be empty.")
    
    response = rag_assistant.answer_question(db=db, trial_id=input_data.trial_id, question=input_data.question)
    return response
