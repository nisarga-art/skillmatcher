from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.models import User
from app.db.session import get_session

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
def get_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return users

@router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/")
def create_user(user: User, session: Session = Depends(get_session)):
    session.add(user)
    session.commit()
    session.refresh(user)
    return user