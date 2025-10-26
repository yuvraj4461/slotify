# backend/ai.py
import os
import json
from openai import OpenAI  # ✅ correct import

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_report_text(report_text: str) -> dict | None:
    """
    Send OCR'd report text to OpenAI and return a small JSON advice structure.
    Returns None if API key missing or error occurs.
    """
    if not os.getenv("OPENAI_API_KEY"):
        print("[AI] OPENAI_API_KEY not set, skipping AI analysis")
        return None

    try:
        prompt = f"""
        You are a medical-assistant helper. Here is a medical report or extracted text:
        \"\"\"{report_text}\"\"\"

        Provide a short JSON object with fields:
        - summary: one-sentence summary of key findings
        - possible_concerns: short comma-separated list
        - advice: short plain-language advice (what to do next)
        - confidence: number 0..1 (float) approximate

        Return only valid JSON.
        """

        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": "You are a concise medical triage assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=250
        )

        text = response.choices[0].message.content
        try:
            return json.loads(text)
        except Exception:
            return {"raw": text}

    except Exception as e:
        print(f"[AI] analyze_report_text error: {e}")
        return {"error": str(e)}
