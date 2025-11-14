import json

# 🧠 Simple helper to simulate extracting skills from a resume text
# (In a real project you can use NLP or AI model here)
def extract_skills_from_resume(resume_path):
    # For now, we just simulate some extracted skills from resume
    # You can later connect a proper text extraction library here
    fake_skills = ["python", "react", "sql", "data analysis", "communication"]
    return fake_skills


# 🧩 Main function to compare resume and job details
def compare_resume_with_job(resume_path, job):
    # Extract resume skills
    extracted_skills = extract_skills_from_resume(resume_path)

    # Convert job.skills JSON string into a Python list
    job_skills = json.loads(job.skills)

    # Compare
    matched = [s for s in job_skills if s.lower() in [x.lower() for x in extracted_skills]]
    missing = [s for s in job_skills if s.lower() not in [x.lower() for x in extracted_skills]]

    # 🧠 Generate improvement recommendations
    recommendations = []
    for skill in missing:
        recommendations.append(f"Improve your {skill} skill to match the {job.title} role better.")

    # Return structured data
    return {
        "matched": matched,
        "missing": missing,
        "recommendations": recommendations
    }
