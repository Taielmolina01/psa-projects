from pytest_bdd import scenario, given, when, then
import pytest
from models import project, task
from service.projects_service import *
from service.tasks_service import *
from models.task import StateTask
from constants import *

@scenario("../features/change_task_priority.feature", "Cambiar y guardar la prioridad de una tarea")
def test_change_priority_status():
    pass

@scenario("../features/change_task_priority.feature", "No guardar cambio de prioridad de una tarea si no hay cambios")
def test_not_change_status():
    pass

@scenario("../features/change_task_priority.feature", "No guardar cambio de prioridad de una tarea si es invalido")
def test_change_task_invalid_status():
    pass


@given("que hay un proyecto con una tarea con prioridad baja")
def project_with_task(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    ) 
    task_test = task.Task(
        project_id=1,
        name=NAME_TASK_1,
        priority=PRIORITY_TASK_1,
        file_foreman=FILE_FOREMAN_TASK_1,
        start_date=START_DATE_TASK_1,
        end_date=END_DATE_TASK_1,
    )
    service_projects = ProjectService(session)
    service_projects.save_project(project_test)
    service_tasks = TaskService(session)
    service_tasks.create_task(task_test)

@when("cambio la prioridad de la tarea a media")
def change_task_status_to_in_progress(session):
    service_tasks = TaskService(session)
    service_tasks.update_state_task(1, PriorityTask.MEDIA)


@when("cambio la prioridad de la tarea a baja")
def step_impl(session):
    service_tasks = TaskService(session)
    service_tasks.update_state_task(1, PriorityTask.BAJA)


@when("la nueva prioridad de la tarea es invalida")
def step_impl(session):
    service_tasks = TaskService(session)
    with pytest.raises(TaskPriorityIsNotValid):
        service_tasks.update_priority_task(1, -1)
        print("Error")

@then("se guarda el cambio de prioridad de la tarea")
def step_impl(session):
    service_tasks = TaskService(session)
    task_test = service_tasks.get_task(1)
    assert task_test.state == PriorityTask.MEDIA

@then("no se guarda el cambio de prioridad de la tarea")
def step_impl(session):
    service_tasks = TaskService(session)
    task_test = service_tasks.get_task(1)
    assert task_test.state == PriorityTask.BAJA