from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import SessionLocal
from models.user import User

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def read_users(db: Session = Depends(get_db)):
    return db.query(User).all()
