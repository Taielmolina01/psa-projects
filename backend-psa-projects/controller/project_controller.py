from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from models.project import StateProject, Project
from database import get_database
from service.projects_service import ProjectService
from service.exceptions.projects_exceptions import *
from pydantic import BaseModel
from typing import List

router = APIRouter()

class ProjectResponse(BaseModel):
    projects: List[Project]

@router.post("/projects")
async def create_project(project: Project,
                         db: Session = Depends(get_database)):
    try:
        return ProjectService(db).save_project(project)
    except ProjectHaveNotName as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveNotLeader as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except LeaderProjectNotRegistered as e:
        raise HTTPException(status_code=status.HTTP_404_BAD_REQUEST, detail=e.message)
    except StateOfProjectIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveNotStartDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveNotEndDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except StartDateProjectGreaterThanEndDateProject as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveInvalidEstimatedHours as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)

@router.get("/projects/{project_id}")
async def get_project(project_id: int,
                      db: Session = Depends(get_database)):
    try:
        return ProjectService(db).get_project(project_id)
    except ProjectNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)

@router.get("/projects")
async def get_projects(db: Session = Depends(get_database)):
    return ProjectService(db).get_projects()

@router.put("/projects/update_project/{project_id}")
async def update_project(project_id: int,
                         new_project: Project,
                         db: Session = Depends(get_database)):
    try:
        return ProjectService(db).update_project(project_id, new_project)
    except ProjectNotFound as e:
        raise HTTPException(status_code=HTTPException.HTTP_404_NOT_FOUND, detail=e.message)
    except ProjectHaveNotName as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveNotLeader as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except LeaderProjectNotRegistered as e:
        raise HTTPException(status_code=status.HTTP_404_BAD_REQUEST, detail=e.message)
    except StateOfProjectIsNotValid as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveNotStartDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveNotEndDate as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except StartDateProjectGreaterThanEndDateProject as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
    except ProjectHaveInvalidEstimatedHours as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)


@router.put("/projects/update_state_project/{project_id}")
async def update_state_project(project_id: int,
                               new_state:  StateProject = Query(...),
                               db: Session = Depends(get_database)):
    try:
        return ProjectService(db).update_state_project(project_id, new_state)
    except ProjectNotFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=e.message)


@router.delete("/projects/{project_id}", status_code=204)
async def delete_project(project_id: int,
                         db: Session = Depends(get_database)):
    try:
        ProjectService(db).delete_project(project_id)
    except ProjectNotFound as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=e.message)
