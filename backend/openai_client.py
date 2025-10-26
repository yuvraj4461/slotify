# backend/openai_client.py
import os
import time
import logging

try:
    import openai
except Exception:
    openai = None

logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-3.5-turbo")  # change to gpt-4 if you have access

if openai and OPENAI_API_KEY:
    openai.api_key = OPENAI_API_KEY

def call_openai_for_triage(symptoms_text: str, max_tokens: int = 120, timeout: int = 10):
    """
    Query OpenAI to extract severity and recommended priority score.
    Returns a dict: {priority_label: "low|medium|high|urgent", numeric_score: int (0..100), reason: str}
    If the API is not available or errors, returns None.
    """
    if not openai or not OPENAI_API_KEY:
        return None

    prompt = f"""
You are a medical triage assistant (non-diagnostic). Given a short description of patient's symptoms, classify urgency and return a short reason and a numeric priority score 0-100 (0 highest urgency). Reply in JSON only with keys:
- priority_label: one of "urgent", "high", "medium", "low"
- numeric_score: integer 0-100 (lower means more urgent)
- reason: short plain-text explanation (1-2 sentences)

Symptoms: \"\"\"{symptoms_text}\"\"\"

Strict JSON only, example:
{{"priority_label":"urgent","numeric_score":5,"reason":"Severe chest pain and breathing difficulty — potential life threat."}}
"""
    try:
        resp = openai.ChatCompletion.create(
            model=OPENAI_MODEL,
            messages=[{"role": "system", "content": "You are a helpful triage assistant that is conservative (prioritize safety)."},
                      {"role": "user", "content": prompt}],
            temperature=0.0,
            max_tokens=max_tokens,
            timeout=timeout,
        )
        text = resp['choices'][0]['message']['content'].strip()
        # attempt to parse JSON inside response
        import json, re
        # find first JSON object in text
        m = re.search(r'\{.*\}', text, re.S)
        if not m:
            logger.warning("OpenAI did not return JSON: %s", text)
            return None
        jtext = m.group(0)
        data = json.loads(jtext)
        # ensure numeric_score in bounds
        data['numeric_score'] = int(max(0, min(100, int(data.get('numeric_score', 100)))))
        return data
    except Exception as e:
        logger.exception("OpenAI triage call failed: %s", e)
        return None
