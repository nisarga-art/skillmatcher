# create_and_seed.py (run from backend folder)
from app.db.session import create_db_and_tables
from app.services.seed import seed_default_jobs

if __name__ == "__main__":
    create_db_and_tables()
    seed_default_jobs()
    print("Database created and seed run.")
