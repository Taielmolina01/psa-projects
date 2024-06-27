from models.project import StateProject
from database import Base
from sqlalchemy import Column, Integer, String, Date, Enum as SQLAEnum
from typing import Optional

class ProjectBase(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key = True, autoincrement=True)
    name = Column(String)
    file_leader = Column(Integer)
    start_date = Column(Date)
    end_date = Column(Date)
    estimated_hours = Column(Integer)
    state = Column(SQLAEnum(StateProject), default=StateProject.NUEVO)