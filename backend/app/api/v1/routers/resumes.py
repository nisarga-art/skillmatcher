from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from sqlmodel import Session, select
from typing import Optional, List
import aiofiles
import json
from tempfile import NamedTemporaryFile

from app.db.models import Resume, Job
from app.db.session import get_session
from app.core.config import settings
from app.services.parsing import parse_resume_file
from app.services.matching import match_skills

router = APIRouter(prefix="/resumes", tags=["resumes"])

# -----------------------------------------------------
# 1️⃣ UPLOAD + ANALYZE RESUME
# -----------------------------------------------------
@router.post("/upload")
async def upload_and_analyze(
    job_id: int = Form(...),
    uploaded_by: Optional[str] = Form(None),
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
):

    # Validate allowed file types
    if not file.filename.lower().endswith((".txt", ".pdf", ".doc", ".docx")):
        raise HTTPException(status_code=400, detail="Unsupported file format")

    # Ensure upload directory exists
    upload_dir = Path(settings.UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    # Save uploaded file
    file_path = upload_dir / file.filename
    async with aiofiles.open(file_path, "wb") as f:
        await f.write(await file.read())

    # Parse resume text
    try:
        resume_text = parse_resume_file(file_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume parsing failed: {str(e)}")

    # Fetch job by ID
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Match skills
    try:
        match_result = match_skills(job.skills, resume_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill matching error: {str(e)}")

    # Generate improved resume
    improved_resume = generate_improved_resume(
        resume_text,
        job.title,
        match_result.get("missing_skills", [])
    )

    # Save resume record to DB
    resume = Resume(
        filename=file.filename,
        text=resume_text,
        uploaded_by=uploaded_by,
        match_result=match_result,
        improved_resume=improved_resume,
        job_id=job.id
    )

    session.add(resume)
    session.commit()
    session.refresh(resume)

    # Prepare frontend recommendation object
    recommendation_item = {
        "title": job.title,
        "match_percent": match_result.get("match_percent", 0),
        "matched_skills": match_result.get("matched_skills", []),
        "missing_skills": match_result.get("missing_skills", []),
    }

    return {
        "message": "Resume analyzed successfully",
        "resume_id": resume.id,
        "job_id": job.id,
        "recommendations": [recommendation_item],
        "improved_resume": improved_resume
    }

# -----------------------------------------------------
# 2️⃣ GET ALL RESUMES
# -----------------------------------------------------
@router.get("/", response_model=List[Resume])
async def get_resumes(session: Session = Depends(get_session)):
    resumes = session.exec(select(Resume)).all()
    for r in resumes:
        if isinstance(r.match_result, str):
            r.match_result = json.loads(r.match_result)
    return resumes

# -----------------------------------------------------
# 3️⃣ GET SINGLE RESUME
# -----------------------------------------------------
@router.get("/{resume_id}", response_model=Resume)
async def get_resume(resume_id: int, session: Session = Depends(get_session)):
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if isinstance(resume.match_result, str):
        resume.match_result = json.loads(resume.match_result)
    return resume

# -----------------------------------------------------
# 4️⃣ DOWNLOAD IMPROVED RESUME
# -----------------------------------------------------
@router.get("/download/{resume_id}")
def download_improved_resume(resume_id: int, session: Session = Depends(get_session)):
    resume = session.get(Resume, resume_id)
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    if not getattr(resume, "improved_resume", None):
        raise HTTPException(status_code=404, detail="Improved resume not found")

    temp_file = NamedTemporaryFile(delete=False, suffix=".txt")
    temp_file.write(resume.improved_resume.encode("utf-8"))
    temp_file.flush()
    temp_file.close()

    return FileResponse(
        temp_file.name,
        media_type="text/plain",
        filename=f"Improved_{resume.filename}"
    )

# -----------------------------------------------------
# 5️⃣ HELPER FUNCTIONS FOR IMPROVED RESUME
# -----------------------------------------------------
def generate_improved_resume(original_text: str, job_title: str, missing_skills: List[str]):
    lines = [l.strip() for l in original_text.split("\n") if l.strip()]
    skills_section = [l for l in lines if "skill" in l.lower()]
    improved = f"""
=====================================================
        IMPROVED RESUME — Optimized for {job_title}
=====================================================

📌 PROFESSIONAL SUMMARY
Highly motivated candidate applying for the role of {job_title}.
Enhanced readability, aligns skills with job requirements.

📌 KEY SKILLS & COMPETENCIES
Core Skills:
{format_bullets(skills_section)}

Added Missing Skills:
{format_bullets(missing_skills if missing_skills else ['No missing skills — excellent match!'])}

📌 PROFESSIONAL EXPERIENCE
{rewrite_experience(lines)}

📌 EDUCATION
{extract_education(lines)}

📌 NOTES
- ATS-friendly formatting
- Structured for recruiter readability

=====================================================
                 END OF IMPROVED RESUME
=====================================================
"""
    return improved.strip()

def format_bullets(items):
    if not items:
        return "  • No data found"
    return "\n".join([f"  • {i}" for i in items])

def rewrite_experience(lines):
    exp = []
    keywords = ["experience", "responsibility", "developed", "managed", "project", "intern"]
    for line in lines:
        if any(k in line.lower() for k in keywords):
            cleaned = line.replace("-", "").strip()
            exp.append(f"  • {rewrite_sentence(cleaned)}")
    return "\n".join(exp) if exp else "  • No experience details detected."

def rewrite_sentence(sentence):
    verbs = ["Developed", "Implemented", "Led", "Improved", "Managed", "Optimized", "Enhanced"]
    if not sentence:
        return ""
    words = sentence.split()
    verb = verbs[len(sentence) % len(verbs)]
    return verb + " " + " ".join(words[1:])

def extract_education(lines):
    edu = [f"  • {line.strip()}" for line in lines if any(x in line.lower() for x in ["bachelor", "master", "degree"])]
    return "\n".join(edu) if edu else "  • No education details detected."
