# backend/Dockerfile — minimal production image with tesseract+poppler
FROM python:3.11-slim

# Install OS-level dependencies (poppler + tesseract and libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    poppler-utils \
    libsm6 libxrender1 libxext6 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# copy and install python deps
COPY backend/requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install -r /app/requirements.txt

# copy backend code
COPY backend /app/backend

# copy .env at build-time is optional; we prefer to use docker-compose env_file
ENV PYTHONUNBUFFERED=1
EXPOSE 8000

# Use Gunicorn with Uvicorn worker for production
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "backend.main:app", \
     "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120"]
