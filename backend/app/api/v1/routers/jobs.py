# app/api/v1/routers/jobs.py

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from sqlmodel import Session, select
import json
from app.db.models import Job
from app.db.session import get_session, engine

router = APIRouter()

# -------------------------
# Pydantic response model
# -------------------------
from pydantic import BaseModel

class JobRead(BaseModel):
    id: int
    title: str
    skills: List[str]
    requirements: List[str]
    demand: str
    avg_salary: str
    description: str

    class Config:
        orm_mode = True

# -------------------------
# GET jobs with optional filtering
# -------------------------
@router.get("/", response_model=List[JobRead])
def get_jobs(
    skip: int = 0,
    limit: int = 50,
    skill: Optional[str] = Query(None, description="Filter jobs by skill")
):
    try:
        with Session(engine) as session:
            jobs_query = select(Job).offset(skip).limit(limit)
            jobs = session.exec(jobs_query).all()

            # Convert JSON strings to Python lists
            for job in jobs:
                job.skills = json.loads(job.skills)
                job.requirements = json.loads(job.requirements)

            # Filter by skill if provided
            if skill:
                filtered = [
                    job for job in jobs
                    if skill.lower() in [s.lower() for s in job.skills]
                ]
                return filtered

            return jobs

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch jobs: {str(e)}")
