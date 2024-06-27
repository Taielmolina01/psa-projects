from sqlalchemy.orm import Session
from table.project_base import ProjectBase
from models.project import StateProject

class ProjectRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_project(self, project_id: int) -> ProjectBase:
        return self.db.query(ProjectBase).filter(ProjectBase.project_id == project_id).first()

    def get_projects(self) -> list[ProjectBase]:
        return self.db.query(ProjectBase).all()

    def save_project(self, project: ProjectBase) -> ProjectBase:
        self.db.add(project)
        self.db.commit()
        self.db.refresh(project)
        return project

    def update_project(self, project: ProjectBase) -> ProjectBase:
        self.db.commit()
        return project
    
    def delete_project(self, project: ProjectBase) -> bool:
        self.db.delete(project)
        self.db.commit()
        return True