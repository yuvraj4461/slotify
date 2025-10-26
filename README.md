HEAD
# slotify
slotify is aactually a rescheduling chatbot that sets the right timing or entry token numberfor the patients 

# Slotify - Appointment Rescheduler

A proof-of-concept application for appointment rescheduling with crowd management using real-time camera footage.

## Project Structure

slotify/
├─ frontend/
│ ├─ package.json
│ ├─ postcss.config.cjs
│ ├─ tailwind.config.cjs
│ ├─ public/
│ │ └─ index.html
│ └─ src/
│ ├─ index.jsx
│ ├─ App.jsx
│ ├─ api.js
│ ├─ styles.css
│ └─ components/
│ ├─ Chat.jsx
│ ├─ SymptomChips.jsx
│ ├─ UploadReport.jsx
│ └─ TokenCard.jsx
├─ backend/
│ ├─ requirements.txt
│ ├─ main.py
│ ├─ models.py
│ ├─ db.sql
│ ├─ triage_rules.py
│ └─ sample_dataset.csv
└─ README.md


## Features

- Real-time appointment management
- Crowd detection and management
- WebRTC video streaming
- Chat-based interface
- Symptom tracking
- Report upload functionality

## Getting Started

1. Install dependencies
2. Start backend server
3. Start frontend server
4. Open browser to localhost:3000
8ae0a4a (Initial commit - Slotify backend and frontend)
