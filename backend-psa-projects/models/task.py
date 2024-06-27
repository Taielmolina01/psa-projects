from enum import Enum
from typing import Optional
from pydantic import BaseModel
from datetime import date

class StateTask(int, Enum):
    NUEVO = 0
    EN_PROGRESO = 1
    BLOQUEADO = 2
    CERRADO = 3

class PriorityTask(int, Enum):
    BAJA = 0
    MEDIA = 1
    ALTA = 2

class Task(BaseModel):
    project_id: int
    name: str
    priority: PriorityTask
    file_foreman: int
    state: Optional[StateTask] = StateTask.NUEVO
    start_date: date
    end_date: date