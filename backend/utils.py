import os
from dotenv import load_dotenv


load_dotenv()


DATABASE_URL = os.getenv('DATABASE_URL')
UPLOAD_DIR = os.getenv('UPLOAD_DIR', './uploads')


os.makedirs(UPLOAD_DIR, exist_ok=True)