from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
import sys

if "pytest" in sys.modules:
    SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
else:
    SQLALCHEMY_DATABASE_URL = "postgresql://psa_postgresql_db_user:hE8GaPWkdNdhXuO6IVGnTcda2fKf2AOc@dpg-cpm7vcmehbks73da1rj0-a.ohio-postgres.render.com/psa_postgresql_db"


engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_database():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()