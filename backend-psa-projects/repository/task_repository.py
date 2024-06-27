from sqlalchemy.orm import Session
from table.task_base import TaskBase
from models.task import Task, StateTask, PriorityTask

class TasksRepository:

    def __init__(self,
                 db: Session):
        self.db = db

    def get_task(self,
                 task_id: int) -> TaskBase:
        return self.db.query(TaskBase).filter(TaskBase.id == task_id).first()

    def get_tasks(self,
                  project_id: int) -> list[TaskBase]:
        tasks = self.db.query(TaskBase).filter(TaskBase.project_id == project_id).all()
        print(tasks)
        return tasks

    def save_task(self,
                  task: TaskBase) -> TaskBase:
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update_task(self,
                    task: TaskBase) -> TaskBase:
        self.db.commit()
        return task

    def delete_task(self,
                    task_id: int) -> bool:
        task = self.get_task(task_id)
        self.db.delete(task)
        self.db.commit()
        return True