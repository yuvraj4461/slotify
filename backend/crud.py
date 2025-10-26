from sqlalchemy.orm import Session
from sqlalchemy import select, func
from . import models


# Helper to get next token_number (simple sequential within all tokens)
def get_next_token_number(db: Session):
	last = db.execute(select(func.max(models.Token.token_number))).scalar_one_or_none()
	return (last or 0) + 1


def get_patient_by_phone(db: Session, phone: str):
	return db.query(models.Patient).filter(models.Patient.phone == phone).first()


def create_patient(db: Session, name: str, phone: str):
	p = models.Patient(name=name, phone=phone)
	db.add(p)
	db.commit()
	db.refresh(p)
	return p


def create_report(db: Session, patient_id: int, file_path: str, ocr_text: str):
	r = models.Report(patient_id=patient_id, file_path=file_path, ocr_text=ocr_text)
	db.add(r)
	db.commit()
	db.refresh(r)
	return r


def create_token(db: Session, patient_id: int, priority_score: int, estimated_wait: int = None):
	token_number = get_next_token_number(db)
	t = models.Token(patient_id=patient_id, token_number=token_number, priority_score=priority_score, estimated_wait=estimated_wait)
	db.add(t)
	db.commit()
	db.refresh(t)
	return t


def get_waiting_queue(db: Session):
	# Returns waiting tokens ordered by priority_score asc, then created_at asc
	return db.query(models.Token).filter(models.Token.status == 'waiting').order_by(models.Token.priority_score.asc(), models.Token.created_at.asc()).all()


def update_token_status(db: Session, token_id: int, status: str):
	t = db.query(models.Token).get(token_id)
	if not t:
		return None
	t.status = status
	db.commit()
	db.refresh(t)
	return t