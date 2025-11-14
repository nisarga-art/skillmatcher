from sqlmodel import create_engine, SQLModel, Session
from app.core.config import settings

# Engine — uses DATABASE_URL from settings
engine = create_engine(settings.DATABASE_URL, echo=False)

def create_db_and_tables() -> None:
    """Create all tables defined in SQLModel models."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency for FastAPI routes: yields a SQLModel session."""
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()
