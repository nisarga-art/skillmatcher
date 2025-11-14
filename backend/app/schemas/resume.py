# skillmatcher/schemas/resume.py
from typing import List, Optional
from pydantic import BaseModel

class MatchResult(BaseModel):
    score: int
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: List[str]

class ResumeRead(BaseModel):
    id: int
    filename: str
    uploaded_by: Optional[str]
    match_result: Optional[MatchResult]
