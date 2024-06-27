from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_database
from models.task import *
from service.tasks_service import TaskService
from service.exceptions.tasks_exceptions import *
from service.exceptions.projects_exceptions import ProjectNotFound
from models.task import Task

router = APIRouter()

@router.post("/projects/{project_id}/create_task/")
async def create_task(task: Task,
                      db: Session = Depends(get_database)):
    try:
        return TaskService(db).create_task(task)
    except ProjectNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TaskWithoutName as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskPriorityIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskWithoutForeman as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except ForemanTaskNotRegistered as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TaskStateIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskHaveNotStartDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskHaveNotEndDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except StartDateTaskGreaterThanEndDateTask as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except StartDateTaskLessThanStartDateProject as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except EndDateTaskGreaterThanEndDateProject as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    

@router.get("/projects/{project_id}/get_tasks/")
async def get_tasks(project_id: int,
                    db: Session = Depends(get_database)):
    try:
        return TaskService(db).get_tasks(project_id)
    except ProjectNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)

@router.get("/projects/get_task/{task_id}/")
async def get_task(task_id: int,
                   db: Session = Depends(get_database)):
    try:
        return TaskService(db).get_task(task_id)
    except TaskNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)

@router.put("/projects/update_task/{task_id}/")
async def update_task(task_id: int,
                      new_task: Task = Body(),
                      db: Session = Depends(get_database)):
    try:
        return TaskService(db).update_task(task_id, new_task)
    except ProjectNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TaskNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TaskWithoutName as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskPriorityIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskWithoutForeman as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except ForemanTaskNotRegistered as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TaskStateIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskHaveNotStartDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except TaskHaveNotEndDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except StartDateTaskGreaterThanEndDateTask as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except StartDateTaskLessThanStartDateProject as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except EndDateTaskGreaterThanEndDateProject as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)

@router.put("/projects/update_state_task/{task_id}/")
async def update_state_task(task_id: int,
                            new_state: StateTask = Body(),
                            db: Session = Depends(get_database)):
    try:
        return TaskService(db).update_state_task(task_id, new_state)
    except TaskNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TaskStateIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    
@router.put("/projects/update_priority_task/{task_id}/")
async def update_priority_task(task_id: int,
                               new_priority: PriorityTask = Body(),
                               db: Session = Depends(get_database)):
    try:
        return TaskService(db).update_priority_task(task_id, new_priority)
    except TaskNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
    except TaskPriorityIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)

@router.delete("/projects/delete_task/{task_id}/", status_code=204)
async def delete_task(task_id: int,
                      db: Session = Depends(get_database)):
    try:
        return TaskService(db).delete_task(task_id)
    except TaskNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)
