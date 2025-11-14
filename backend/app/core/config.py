# skillmatcher/core/config.py
from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    APP_NAME: str = "Skillmatcher"
    DATABASE_URL: str = "sqlite:///./skillmatcher.db"
    UPLOAD_DIR: str = str(Path(__file__).resolve().parents[2] / "uploads")
    MATCH_THRESHOLD: int = 75

    class Config:
        env_file = str(Path(__file__).resolve().parents[2] / ".env")

settings = Settings()
