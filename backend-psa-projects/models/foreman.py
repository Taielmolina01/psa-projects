from pydantic import BaseModel

class Project(BaseModel):
    file_worker: int
    first_name: str
    last_name: str