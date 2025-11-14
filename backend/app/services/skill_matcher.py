from difflib import SequenceMatcher

def match_skills(resume_text: str, job_skills: list[str]) -> dict:
    matched = []
    missing = []

    for skill in job_skills:
        if skill.lower() in resume_text:
            matched.append(skill)
        else:
            missing.append(skill)

    suggestions = []
    if missing:
        suggestions.append("Consider learning or highlighting these missing skills.")
    if len(matched) / len(job_skills) < 0.5:
        suggestions.append("Your resume could better align with this job role.")
    else:
        suggestions.append("Your resume matches well! Minor improvements can make it stronger.")

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "suggestions": suggestions,
    }
