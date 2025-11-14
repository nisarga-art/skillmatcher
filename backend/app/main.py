from fastapi import FastAPI, HTTPException, Query, APIRouter, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, Field, Session, create_engine, select
from typing import List, Optional, Generator
from pathlib import Path
import json
import logging
import shutil


# -------------------------
# Logging setup
# -------------------------
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

# -------------------------
# Database setup
# -------------------------
DATABASE_URL = "sqlite:///./skillmatcher.db"
engine = create_engine(DATABASE_URL, echo=False)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)
    logging.info("✅ Database tables created.")

# -------------------------
# Job Model
# -------------------------
class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    skills: str           # Stored as JSON string
    requirements: str     # Stored as JSON string
    demand: str
    avg_salary: str
    description: str

# -------------------------
# Resume Model
# -------------------------
class Resume(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    uploaded_by: str
    job_id: Optional[int] = None
    file_path: Optional[str] = None
    match_result: Optional[str] = None

# -------------------------
# Seed jobs from JSON
# -------------------------
DATA_FILE = Path(__file__).parent / "data/jobs.json"

def seed_default_jobs() -> None:
    if not DATA_FILE.exists():
        logging.warning(f"⚠️ JSON data file not found: {DATA_FILE}")
        return

    with open(DATA_FILE, "r", encoding="utf-8") as f:
        jobs_list = json.load(f)

    with Session(engine) as session:
        for job_data in jobs_list:
            existing = session.get(Job, job_data["id"])
            if not existing:
                job_data["skills"] = json.dumps(job_data.get("skills", []))
                job_data["requirements"] = json.dumps(job_data.get("requirements", []))
                job = Job(**job_data)
                session.add(job)
                logging.info(f"✅ Added job: {job.title}")
        session.commit()
        logging.info("🌟 Job seeding complete!")

# -------------------------
# FastAPI app setup
# -------------------------
app = FastAPI(
    title="Skillmatcher API",
    version="1.2.0",
    description="API for job listings, resume uploads, and intelligent skill matching"
)

# Allow all origins (can restrict later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# -------------------------
# Startup event
# -------------------------
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_default_jobs()
    logging.info("🚀 Application startup complete!")

# -------------------------
# Root endpoint
# -------------------------
@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Skillmatcher API is running 🚀",
        "routes": ["/jobs", "/resumes/upload", "/resumes", "/docs"]
    }

# ============================================================
# JOBS ROUTER
# ============================================================
jobs_router = APIRouter(prefix="/jobs", tags=["Jobs"])

@jobs_router.get("/", response_model=List[Job])
def get_jobs(skip: int = 0, limit: int = 50, session: Session = Depends(get_session)):
    jobs = session.exec(select(Job).offset(skip).limit(limit)).all()
    logging.info(f"Fetched {len(jobs)} jobs from DB")
    return jobs

@jobs_router.get("/{job_id}", response_model=Job)
def get_job(job_id: int, session: Session = Depends(get_session)):
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@jobs_router.get("/filter", response_model=List[Job])
def filter_jobs(skill: str = Query(...), session: Session = Depends(get_session)):
    jobs = session.exec(select(Job)).all()
    filtered = [
        job for job in jobs
        if skill.lower() in [s.lower() for s in json.loads(job.skills)]
    ]
    logging.info(f"Filtered jobs by skill '{skill}': {len(filtered)} found")
    return filtered

app.include_router(jobs_router)

# ============================================================
# USERS ROUTER
# ============================================================
users_router = APIRouter(prefix="/users", tags=["Users"])

@users_router.get("/")
def get_users():
    return {"message": "Users endpoint placeholder"}

app.include_router(users_router)

# ============================================================
# RESUMES ROUTER
# ============================================================
resumes_router = APIRouter(prefix="/resumes", tags=["Resumes"])

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

def extract_skills_from_resume(content: str):
    """Mock skill extraction from plain text."""
    common_skills = [
        "python", "react", "javascript", "sql", "html", "css", "java",
        "communication", "leadership", "data analysis", "machine learning",
        "tailwind", "typescript", "redux"
    ]
    found = [s for s in common_skills if s.lower() in content.lower()]
    return list(set(found))

@resumes_router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_id: int = Form(...),
    uploaded_by: str = Form(...),
    session: Session = Depends(get_session)
):
    file_path = UPLOAD_DIR / file.filename

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read file content safely
    content = ""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except Exception as e:
        logging.warning(f"Could not read resume content: {e}")

    # Extract resume skills
    resume_skills = extract_skills_from_resume(content)

    # Fetch job details
    job = session.get(Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_skills = json.loads(job.skills)
    matched = [s for s in job_skills if s.lower() in [r.lower() for r in resume_skills]]
    missing = [s for s in job_skills if s.lower() not in [r.lower() for r in resume_skills]]

    # Calculate match percentage
    match_percent = round((len(matched) / len(job_skills)) * 100, 2) if job_skills else 0

    # Recommendations format
    recommendation = {
        "title": job.title,
        "match_percent": match_percent,
        "matched_skills": matched,
        "missing_skills": missing
    }

    match_result = {
        "matched": matched,
        "missing": missing,
        "recommendations": [
            f"Improve your {skill} skill to increase compatibility with the {job.title} role."
            for skill in missing
        ],
    }

    # Save resume info to DB
    resume_entry = Resume(
        filename=file.filename,
        uploaded_by=uploaded_by,
        job_id=job_id,
        file_path=str(file_path),
        match_result=json.dumps(match_result)
    )

    session.add(resume_entry)
    session.commit()
    session.refresh(resume_entry)

    return {
        "message": "✅ Resume uploaded successfully!",
        "recommendations": [recommendation]
    }

@resumes_router.get("/")
def get_resumes(session: Session = Depends(get_session)):
    resumes = session.exec(select(Resume)).all()
    return resumes

app.include_router(resumes_router)
