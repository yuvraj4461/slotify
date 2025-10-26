# backend/ai.py
import os, json
from openai import OpenAI

client = None
if os.getenv("OPENAI_API_KEY"):
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_report_text(report_text: str) -> dict | None:
    """Return a small dict with summary, possible_concerns, advice, confidence."""
    if not client:
        print("[AI] OPENAI_API_KEY not set, skipping")
        return None

    prompt = f"""
You are a concise medical assistant. Given the following extracted report text, return a JSON object with keys:
  summary (one short sentence),
  possible_concerns (comma-separated list),
  advice (one short plain-language action),
  confidence (0.0-1.0 float).

Report text:
\"\"\"{report_text}\"\"\"

Return only valid JSON.
"""
    resp = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": "You are a helpful and concise medical assistant."},
            {"role": "user", "content": prompt},
        ],
        max_tokens=200,
        temperature=0.0,
    )
    text = resp.choices[0].message.content
    # Try to parse JSON; if model returned plain text wrap fallback
    try:
        return json.loads(text)
    except Exception:
        return {"raw": text}

