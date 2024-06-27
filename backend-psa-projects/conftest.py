import pytest
import os

from database import (
    Base,
    engine,
    SessionLocal,
)


@pytest.fixture(scope="function", autouse=True)
def session():
    if engine.url.database != ":memory:":
        raise ValueError("The database should be in memory")
    Base.metadata.create_all(bind=engine)
    try:
        with SessionLocal() as session:
            yield session
    finally:
        Base.metadata.drop_all(bind=engine)

