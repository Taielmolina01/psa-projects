from models.task import StateTask, PriorityTask
from database import Base
from sqlalchemy import Column, Integer, Date, String, Enum as SQLAEnum, ForeignKey

class TaskBase(Base):
    __tablename__ = "tasks"

    project_id = Column(ForeignKey("projects.project_id"))
    id = Column(Integer, primary_key = True, autoincrement=True)
    name = Column(String)
    priority = Column(SQLAEnum(PriorityTask))
    file_foreman = Column(Integer) 
    state = Column(SQLAEnum(StateTask))
    start_date = Column(Date)
    end_date = Column(Date)
