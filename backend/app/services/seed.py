from sqlmodel import Session, select
from ..db.session import engine
from ..db.models import Job

DEFAULT_JOBS = [
    {"title":"Frontend Developer", "description":"Build UI with React/HTML/CSS", "required_skills":["javascript","react","html","css"]},
    {"title":"Backend Developer", "description":"APIs, databases and server-side", "required_skills":["python","sql","api","django","fastapi"]},
    {"title":"Data Analyst", "description":"Data cleaning and analysis", "required_skills":["python","pandas","sql","excel"]},
    {"title":"UI/UX Designer", "description":"Design user experiences", "required_skills":["figma","ux","ui","wireframing"]},
]

def seed_default_jobs():
    """Insert default jobs if Job table is empty."""
    with Session(engine) as session:
        existing = session.exec(select(Job)).all()
        if existing:
            return
        for j in DEFAULT_JOBS:
            job = Job(
                title=j["title"],
                description=j["description"],
                required_skills=j["required_skills"]
            )
            session.add(job)
        session.commit()
