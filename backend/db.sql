-- Database schema - to be implemented
CREATE DATABASE slotifydb;


-- Later use the ORM's migrations (alembic) or run a manual schema like below in the slotifydb:


CREATE TABLE patients (
id SERIAL PRIMARY KEY,
name VARCHAR(200) NOT NULL,
phone VARCHAR(20) NOT NULL UNIQUE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


CREATE TABLE tokens (
id SERIAL PRIMARY KEY,
patient_id INTEGER REFERENCES patients(id),
token_number INTEGER NOT NULL,
status VARCHAR(20) NOT NULL DEFAULT 'waiting',
priority_score INTEGER NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
estimated_wait INTEGER
);


CREATE TABLE reports (
id SERIAL PRIMARY KEY,
patient_id INTEGER REFERENCES patients(id),
file_path TEXT,
ocr_text TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);


CREATE TABLE events (
id SERIAL PRIMARY KEY,
token_id INTEGER REFERENCES tokens(id),
actor VARCHAR(100),
action VARCHAR(200),
metadata JSONB,
timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);