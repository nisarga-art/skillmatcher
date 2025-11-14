# app/api/v1/api.py
from fastapi import APIRouter
from app.api.v1.routers import jobs, resume_analysis

router = APIRouter()

# Include all routers here
router.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
router.include_router(resume_analysis.router, prefix="/resume", tags=["Resume"])
