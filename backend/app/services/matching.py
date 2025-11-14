# skillmatcher/services/matching.py
import re
from typing import List, Dict

def normalize(text: str) -> str:
    return re.sub(r'[^a-z0-9\s]', ' ', (text or "").lower())

def skills_from_text(text: str) -> set:
    # very naive: split on non-word and return unique words > 1 char
    words = set(w for w in normalize(text).split() if len(w) > 1)
    return words

def match_skills(job_skills: List[str], resume_text: str) -> Dict:
    resume_words = skills_from_text(resume_text)
    required = [s.lower().strip() for s in job_skills]
    matched = []
    missing = []
    for s in required:
        # match exact word or multi-word presence
        if all(part in resume_words for part in s.split()):
            matched.append(s)
        else:
            missing.append(s)
    # score = (matched / required) * 100
    score = int(round((len(matched) / max(1, len(required))) * 100))
    suggestions = []
    if score < 100:
        suggestions.append("Add missing skills listed above to improve match.")
    if "python" not in resume_words and any("python" in js for js in required):
        suggestions.append("Consider adding Python projects or experience.")
    # Return as ints and lists of strings
    return {"score": score, "matched_skills": matched, "missing_skills": missing, "suggestions": suggestions}
