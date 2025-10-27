import os
import io
from fastapi import UploadFile, File
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from . import models, crud, triage_rules, utils, ocr
from .models import Base
from .ai import analyze_report_text 
from .ocr import perform_ocr
from PIL import Image
import pytesseract



load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    DATABASE_URL = 'sqlite:///./slotify.db'

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith('sqlite') else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables if not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title='Slotify API')
from os import getenv

# Read allowed origins from environment variable (comma separated)
origins = getenv("CORS_ALLOW_ORIGINS", "").split(",") if getenv("CORS_ALLOW_ORIGINS") else []

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["http://localhost:3000"],  # fallback for local dev
    allow_methods=["*"],
    allow_headers=["*"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/v1/report/upload")
async def upload_report(file: UploadFile = File(...), db=Depends(get_db)):
    # save file logic (your existing code)
    contents = await file.read()
    # --- save to disk, create DB record, etc. ---
    # optionally run OCR to extract text (you likely already do this)
    report_text = utils.extract_text_from_file_bytes(contents)  # or your existing OCR flow
    # Run AI analysis if key present
    ai_advice = None
    try:
        ai_advice = analyze_report_text(report_text)  # returns dict or None
    except Exception as e:
        print(f"[AI Error] {e}")
        ai_advice = {"error": str(e)}
    return {
        "file": file.filename,
        "ocr_text": report_text[:400],   # short preview
        "report_id": 123,                # your ID
        "ai_advice": ai_advice
    }

@app.post('/api/v1/token/request')
def request_token(name: str = Form(...), phone: str = Form(...), symptoms: str = Form(''), db=Depends(get_db)):
    # Ensure patient exists
    patient = crud.get_patient_by_phone(db, phone)
    if not patient:
        patient = crud.create_patient(db, name, phone)

    # compute priority
    # in backend/main.py, inside request_token endpoint

    priority_score = triage_rules.compute_priority(symptoms)

    # Log if using OpenAI
    if os.getenv("OPENAI_API_KEY"):
        print(f"[triage] OpenAI enabled - computed priority_score={priority_score} for symptoms={symptoms}")
    else:
        print(f"[triage] rule-based priority_score={priority_score} for symptoms={symptoms}")


    # estimated wait: naive 5 minutes per waiting patient ahead
    queue = crud.get_waiting_queue(db)
    ahead = sum(1 for t in queue if (t.priority_score < priority_score) or (t.priority_score == priority_score))
    estimated_wait = ahead * 5

    token = crud.create_token(db, patient.id, priority_score, estimated_wait)

    return {
        "token_id": token.id,
        "token_number": token.token_number,
        "status": token.status,
        "priority_score": token.priority_score,
        "estimated_wait": token.estimated_wait,
    }

@app.get('/api/v1/queue')
def get_queue(db=Depends(get_db)):
    queue = crud.get_waiting_queue(db)
    return [{"token_id": t.id, "token_number": t.token_number, "patient_id": t.patient_id, "priority_score": t.priority_score, "created_at": t.created_at.isoformat()} for t in queue]

@app.get('/api/v1/token/{token_id}')
def get_token(token_id: int, db=Depends(get_db)):
    t = db.get(models.Token, token_id)
    if not t:
        raise HTTPException(404, 'Token not found')
    return {
        "token_id": t.id,
        "token_number": t.token_number,
        "status": t.status,
        "priority_score": t.priority_score,
        "estimated_wait": t.estimated_wait,
    }
@app.post('/api/v1/token/{token_id}/update_status')
def update_token_status(token_id: int, status: str = Form(...), db=Depends 
(get_db)):
    t = crud.update_token_status(db, token_id, status)
    if not t:
        raise HTTPException(404, 'Token not found')
    return {
        "token_id": t.id,
        "token_number": t.token_number,
        "status": t.status,
        "priority_score": t.priority_score,
        "estimated_wait": t.estimated_wait,
    }
@app.get("/")
def root():
    return {"message": "Slotify API is running ✅"}

from fastapi.responses import JSONResponse

@app.get("/api/v1/admin/patients")
def get_all_patients(db=Depends(get_db)):
    try:
        patients = db.execute("SELECT * FROM patient").fetchall()
        return {"patients": [dict(row._mapping) for row in patients]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/v1/admin/tokens")
def get_all_tokens(db=Depends(get_db)):
    try:
        tokens = db.execute("SELECT * FROM token").fetchall()
        return {"tokens": [dict(row._mapping) for row in tokens]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
