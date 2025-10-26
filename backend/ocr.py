# backend/ocr.py
from PIL import Image
import pytesseract
import os

# If tesseract is not on PATH (Windows), uncomment and update:
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def perform_ocr(file_path: str) -> str:
    """
    Run Tesseract OCR on an image or the first page of a PDF (if pdf2image + poppler installed).
    Returns extracted text (string).
    """
    _, ext = os.path.splitext(file_path.lower())
    text = ''
    try:
        if ext in ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']:
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img)
        elif ext == '.pdf':
            # PDF -> image conversion requires pdf2image and OS poppler
            try:
                from pdf2image import convert_from_path
                pages = convert_from_path(file_path, first_page=1, last_page=1)
                if pages:
                    text = pytesseract.image_to_string(pages[0])
                else:
                    text = '[PDF OCR: no pages found]'
            except Exception as e:
                text = '[PDF OCR requires pdf2image + poppler; install them to enable PDF OCR]'
        else:
            text = ''
    except Exception as e:
        text = f'[OCR error: {e}]'
    return text
