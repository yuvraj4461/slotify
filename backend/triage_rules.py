# backend/triage_rules.py
from typing import Optional
import os

# keep the previous rules as a fallback
TRIAGE_RULES = {
    "chest pain": 95,
    "breathing difficulty": 90,
    "unconscious": 100,
    "bleeding": 85,
    "fever": 30,
    "cough": 20,
    "cold": 15,
    "headache": 25,
    "stomach pain": 40,
}

# imports for openai client
from .openai_client import call_openai_for_triage

def _rule_based_priority(symptoms_text: str) -> int:
    """Return a numeric priority (lower = more urgent) using the old rules."""
    if not symptoms_text:
        return 100
    text = symptoms_text.lower()
    max_score = 10
    for key, score in TRIAGE_RULES.items():
        if key in text:
            max_score = max(max_score, score)
    priority_score = max(0, 100 - max_score)
    return priority_score

def compute_priority(symptoms_text: str) -> int:
    """
    Main function used by the app to compute a numeric priority score.
    Lower score = higher priority (0 is highest).
    Priority computation flow:
      1. If OPENAI_API_KEY is set, call OpenAI to interpret symptoms and return numeric_score.
      2. If OpenAI fails or not configured, fall back to rule-based scorer.
    """
    # attempt OpenAI first (if available)
    try:
        ai_result = call_openai_for_triage(symptoms_text)
        if ai_result and 'numeric_score' in ai_result:
            # ensure integer and in proper bounds
            score = int(ai_result['numeric_score'])
            score = max(0, min(100, score))
            return score
    except Exception:
        # swallow AI errors and fallback
        pass

    # fallback: rule-based
    return _rule_based_priority(symptoms_text)
