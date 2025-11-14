from sqlmodel import SQLModel, Field, Column
from typing import Optional, Dict, Any, List
from sqlalchemy import JSON

class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: str
    required_skills: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    requirements: Optional[List[str]] = Field(default=None, sa_column=Column(JSON))
    demand: Optional[str] = None
    avg_salary: Optional[str] = None

class Resume(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    text: str
    uploaded_by: Optional[str] = None
    match_result: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSON))

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
