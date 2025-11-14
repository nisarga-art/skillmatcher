# skillmatcher/schemas/job.py
from typing import List, Optional
from pydantic import BaseModel

class JobCreate(BaseModel):
    title: str
    description: Optional[str]
    required_skills: List[str] = []

class JobRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    required_skills: List[str] = []
