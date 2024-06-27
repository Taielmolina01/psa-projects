from sqlalchemy.orm import Session
from service.projects_service import *
from models.project import Project, StateProject
from repository.project_repository import ProjectRepository
from table.project_base import ProjectBase
from service.exceptions.projects_exceptions import *
from service.tasks_service import TaskService
from controller.foreman_controller import get_foremans
import json

class ProjectService:

    possibles_states = [StateProject.NUEVO,
                        StateProject.CERRADO,
                        StateProject.BLOQUEADO,
                        StateProject.EN_PROGRESO,
                        StateProject.ESPERANDO_CLIENTE,
                        StateProject.ESPERANDO_DESARROLLO,
                        StateProject.RESUELTO_ESPERANDO_CONFIRMACION]

    def __init__(self,
                 db: Session):
        self.project_repository = ProjectRepository(db)
        self.task_service = TaskService(db)

    def save_project(self,
                     project: Project) -> ProjectBase:
        if not project.name:
            raise ProjectHaveNotName()
        if not project.file_leader:
            raise ProjectHaveNotLeader()
        foremans_dict = {f["legajo"]: f for f in get_foremans()}
        if project.file_leader not in foremans_dict.keys():
            raise LeaderProjectNotRegistered()
        if project.estimated_hours <= 0:
            raise ProjectHaveInvalidEstimatedHours()
        if project.state not in self.possibles_states:
            raise StateOfProjectIsNotValid()
        if not project.start_date:
            raise ProjectHaveNotStartDate()
        if not project.end_date:
            raise ProjectHaveNotEndDate()
        if project.start_date > project.end_date:
            raise StartDateProjectGreaterThanEndDateProject()
        new_project = ProjectBase(**project.model_dump())
        return self.project_repository.save_project(new_project)

    def get_project(self,
                    project_id: int) -> ProjectBase:
        project = self.project_repository.get_project(project_id)
        if project is None:
            raise ProjectNotFound(project_id)
        return project

    def get_projects(self) -> list[ProjectBase]:
        projects = self.project_repository.get_projects()
        return projects
    
    def update_project(self,
                       project_id: int,
                       new_project: Project) -> ProjectBase:
        actual_project = self.get_project(project_id)
        if not new_project.name:
            raise ProjectHaveNotName()
        if not new_project.file_leader:
            raise ProjectHaveNotLeader()
        foremans_dict = {f["legajo"]: f for f in get_foremans()}
        if new_project.file_leader not in foremans_dict.keys():
            raise LeaderProjectNotRegistered()
        if new_project.estimated_hours <= 0:
            raise ProjectHaveInvalidEstimatedHours()
        if new_project.state not in self.possibles_states:
            raise StateOfProjectIsNotValid()
        if not new_project.start_date:
            raise ProjectHaveNotStartDate()
        if not new_project.end_date:
            raise ProjectHaveNotEndDate()
        if new_project.start_date > new_project.end_date:
            raise StartDateProjectGreaterThanEndDateProject()
        actual_project.name = new_project.name
        actual_project.file_leader = new_project.file_leader
        actual_project.start_date = new_project.start_date
        actual_project.end_date = new_project.end_date
        actual_project.estimated_hours = new_project.estimated_hours
        return self.project_repository.update_project(actual_project)

    def update_state_project(self,
                             project_id: int,
                             new_state: StateProject):
        actual_project = self.get_project(project_id)
        if new_state not in self.possibles_states:
            raise StateOfProjectIsNotValid()
        if new_state == actual_project.state:
            return actual_project
        actual_project.state = new_state
        return self.project_repository.save_project(actual_project)
    
    def delete_project(self,
                       project_id: int) -> bool:
        to_delete_project = self.get_project(project_id)
        self.task_service.delete_tasks_by_project_id(project_id)
        return self.project_repository.delete_project(to_delete_project)