from enum import Enum
from datetime import date
from pydantic import BaseModel
from typing import Optional

class StateProject(int, Enum):
    NUEVO = 0
    EN_PROGRESO = 1
    ESPERANDO_CLIENTE = 2
    ESPERANDO_DESARROLLO = 3
    RESUELTO_ESPERANDO_CONFIRMACION = 4
    BLOQUEADO = 5
    CERRADO = 6

class Project(BaseModel):
    name: str
    file_leader: int
    start_date: date
    end_date: date
    estimated_hours: int
    state: Optional[StateProject] = StateProject.NUEVO