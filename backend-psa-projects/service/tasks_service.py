from models.task import Task, StateTask, PriorityTask
from repository.task_repository import TasksRepository
from sqlalchemy.orm import Session
from table.task_base import TaskBase
from fastapi import HTTPException, status
from service.exceptions.tasks_exceptions import *
from service.exceptions.projects_exceptions import ProjectNotFound
from service.project_from_task_service import ProjectFromTaskService
from controller.foreman_controller import get_foremans
import json

class TaskService:

    possibles_states = [StateTask.NUEVO,
                        StateTask.EN_PROGRESO,
                        StateTask.BLOQUEADO,
                        StateTask.CERRADO
                        ]

    possibles_priorities = [PriorityTask.BAJA,
                            PriorityTask.MEDIA,
                            PriorityTask.ALTA]

    def __init__(self, db: Session):
        self.tasks_repository = TasksRepository(db)
        self.project_from_task_service = ProjectFromTaskService(db)

    def create_task(self,
                    task: Task) -> Task:
        if not self.project_from_task_service.exists_project(task.project_id):
            raise ProjectNotFound(task.project_id)
        if task.name == "":
            raise TaskWithoutName()
        if task.priority not in self.possibles_priorities:
            raise TaskPriorityIsNotValid(task.priority)
        if task.file_foreman <= 0:
            raise TaskWithoutForeman()
        foremans_dict = {f["legajo"]: f for f in get_foremans()}
        if task.file_foreman not in foremans_dict.keys():
            raise ForemanTaskNotRegistered()
        if task.state not in self.possibles_states:
            raise TaskStateIsNotValid(task.state)
        if not task.start_date:
            raise TaskHaveNotStartDate()
        if not task.end_date:
            raise TaskHaveNotEndDate()
        if task.start_date > task.end_date:
            raise StartDateTaskGreaterThanEndDateTask()
        project_start_date, project_end_date = self.project_from_task_service.get_project_dates(task.project_id)
        if task.start_date < project_start_date:
            raise StartDateTaskLessThanStartDateProject()
        if task.end_date > project_end_date:
            raise EndDateTaskGreaterThanEndDateProject()
        new_task = TaskBase(**task.model_dump())
        return self.tasks_repository.save_task(new_task)

    def get_task(self,
                 task_id: int) -> TaskBase:
        task = self.tasks_repository.get_task(task_id)
        if not task:
            raise TaskNotFound(task_id)
        return task


    def get_tasks(self,
                  project_id: int) -> list[Task]:
        if not self.project_from_task_service.exists_project(project_id):
            raise ProjectNotFound(project_id)
        tasks = self.tasks_repository.get_tasks(project_id)
        return tasks

    def update_task(self, 
                    task_id: int,
                    new_task: Task) -> Task:
        actual_task = self.get_task(task_id)
        if not self.project_from_task_service.exists_project(actual_task.project_id):
            raise ProjectNotFound(actual_task.project_id)
        if not self.project_from_task_service.exists_project(new_task.project_id):
            raise ProjectNotFound(new_task.project_id)
        if new_task.name == "":
            raise TaskWithoutName()
        if new_task.priority not in self.possibles_priorities:
            raise TaskPriorityIsNotValid(new_task.priority)
        if new_task.file_foreman <= 0:
            raise TaskWithoutForeman()
        foremans_dict = {f["legajo"]: f for f in get_foremans()}
        if new_task.file_foreman not in foremans_dict.keys():
            raise ForemanTaskNotRegistered()
        if new_task.state not in self.possibles_states:
            raise TaskStateIsNotValid(new_task.state)
        if not new_task.start_date:
            raise TaskHaveNotStartDate()
        if not new_task.end_date:
            raise TaskHaveNotEndDate()
        if new_task.start_date > new_task.end_date:
            raise StartDateTaskGreaterThanEndDateTask()
        project_start_date, project_end_date = self.project_from_task_service.get_project_dates(actual_task.project_id)
        if new_task.start_date < project_start_date:
            raise StartDateTaskLessThanStartDateProject()
        if new_task.end_date > project_end_date:
            raise EndDateTaskGreaterThanEndDateProject()
        actual_task.project_id = new_task.project_id
        actual_task.name = new_task.name
        actual_task.priority = new_task.priority
        actual_task.file_foreman = new_task.file_foreman
        actual_task.start_date = new_task.start_date
        actual_task.end_date = new_task.end_date
        return self.tasks_repository.update_task(actual_task)
        
    def update_state_task(self,
                          task_id: int,
                          new_state: StateTask) -> TaskBase:
        actual_task = self.get_task(task_id)
        if new_state not in self.possibles_states:
            raise TaskStateIsNotValid(new_state)
        if actual_task.state == new_state:
            return actual_task
        actual_task.state = new_state
        return self.tasks_repository.save_task(actual_task)
    
    def update_priority_task(self,
                             task_id: int, 
                             new_priority: PriorityTask) -> TaskBase:
        actual_task = self.get_task(task_id)
        if new_priority not in self.possibles_priorities:
            raise TaskPriorityIsNotValid(new_priority)
        if actual_task.priority == new_priority:
            return actual_task
        actual_task.priority = new_priority
        return self.tasks_repository.save_task(actual_task)

    def delete_task(self,
                    task_id: int) -> bool:
        actual_task = self.get_task(task_id)
        return self.tasks_repository.delete_task(task_id)

    def delete_tasks_by_project_id(self,
                                   project_id: int):
        tasks = self.get_tasks(project_id)
        for task in tasks:
            self.delete_task(task.id)