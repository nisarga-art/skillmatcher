from fastapi import APIRouter, UploadFile, File, HTTPException
from sqlmodel import Session, select
from app.db.session import engine
from app.db.models import Resume, Job
import fitz  # PyMuPDF
import re

router = APIRouter()


# -----------------------------
# PDF Text Extraction
# -----------------------------
def extract_text_from_pdf(file: UploadFile) -> str:
    text = ""
    # Read PDF with PyMuPDF
    with fitz.open(stream=file.file.read(), filetype="pdf") as doc:
        for page in doc:
            text += page.get_text("text")
    return text


# -----------------------------
# Resume Analysis Endpoint
# -----------------------------
@router.post("/analyze_resume/")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Extract and clean text
    text = extract_text_from_pdf(file)
    clean_text = re.sub(r"\s+", " ", text.lower())

    # Fetch all jobs from DB
    with Session(engine) as session:
        jobs = session.exec(select(Job)).all()

    match_results = []
    for job in jobs:
        required_skills = job.required_skills or []
        match_count = sum(1 for skill in required_skills if skill.lower() in clean_text)
        score = round((match_count / len(required_skills)) * 100, 2) if required_skills else 0

        match_results.append({
            "job_title": job.title,
            "match_score": score,
            "skills_matched": match_count,
            "total_skills": len(required_skills),
            "demand": getattr(job, "demand", None),       # Added job demand
            "avg_salary": getattr(job, "avg_salary", None) # Added average salary
        })

    # Save resume with match results
    resume = Resume(
        filename=file.filename,
        text=text,
        match_result={"results": match_results}
    )
    with Session(engine) as session:
        session.add(resume)
        session.commit()
        session.refresh(resume)

    return {"message": "Resume analyzed successfully", "results": match_results}
