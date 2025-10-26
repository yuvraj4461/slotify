# Database models - to be implemented
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import func

Base = declarative_base()

class Patient(Base):
    __tablename__ = 'patients'
    id = Column(Integer, primary_key=True)
    name = Column(String(200), nullable=False)
    phone = Column(String(20), nullable=False, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    tokens = relationship('Token', back_populates='patient', cascade='all, delete-orphan')
    reports = relationship('Report', back_populates='patient', cascade='all, delete-orphan')

class Token(Base):
    __tablename__ = 'tokens'
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    token_number = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False, default='waiting')
    priority_score = Column(Integer, nullable=False)
    estimated_wait = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    patient = relationship('Patient', back_populates='tokens')

class Report(Base):
    __tablename__ = 'reports'
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'))
    file_path = Column(Text)
    ocr_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship('Patient', back_populates='reports')

class Event(Base):
    __tablename__ = 'events'
    id = Column(Integer, primary_key=True)
    token_id = Column(Integer, ForeignKey('tokens.id'))
    actor = Column(String(100))
    action = Column(String(200))
    # avoid using attribute name `metadata` (reserved by SQLAlchemy)
    metadata_json = Column('metadata', Text)    # Python attr = metadata_json, DB column = "metadata"
    timestamp = Column(DateTime(timezone=True), server_default=func.now())