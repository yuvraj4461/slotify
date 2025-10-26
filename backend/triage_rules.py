# Simple triage scoring rules for Slotify — same as frontend doc but included here
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




def compute_priority(symptoms_text: str) -> int:
	if not symptoms_text:
		return 100
	text = symptoms_text.lower()
	max_score = 10
	for key, score in TRIAGE_RULES.items():
		if key in text:
			max_score = max(max_score, score)
	wait_penalty = 0 # calculated during reordering; for new token it's 0
	priority_score = max(0, 100 - max_score + wait_penalty)
	return priority_score