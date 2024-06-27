from sqlalchemy.orm import Session
from table.project_base import ProjectBase

class ProjectFromTaskService:

    def __init__(self, db: Session):
        self.db = db

    def exists_project(self, project_id: int):
        return self.db.query(ProjectBase).filter(ProjectBase.project_id == project_id).first() is not None

    def get_project_dates(self, project_id: int):
        project = self.db.query(ProjectBase).filter(ProjectBase.project_id == project_id).first()
        return project.start_date, project.end_date