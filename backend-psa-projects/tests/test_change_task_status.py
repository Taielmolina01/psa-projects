from pytest_bdd import scenario, given, when, then
import pytest
from models import project, task
from service.projects_service import *
from service.tasks_service import *
from models.task import StateTask
from constants import *

@scenario("../features/change_task_status.feature", "Cambiar y guardar el estado de una tarea")
def test_change_task_status():
    pass

@scenario("../features/change_task_status.feature", "No guardar cambio de estado de una tarea si no hay cambios")
def test_not_change_status():
    pass

@scenario("../features/change_task_status.feature", "No guardar cambio de estado de una tarea si es invalido")
def test_change_task_invalid_status():
    pass


@given("que hay un proyecto con una tarea en estado nuevo")
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

@when("cambio el estado de la tarea a en progreso")
def change_task_status_to_in_progress(session):
    service_tasks = TaskService(session)
    service_tasks.update_state_task(1, StateTask.EN_PROGRESO)


@when("cambio el estado de la tarea a nuevo")
def step_impl(session):
    service_tasks = TaskService(session)
    service_tasks.update_state_task(1, StateTask.NUEVO)


@when("el nuevo estado de la tarea es invalido")
def step_impl(session):
    service_tasks = TaskService(session)
    with pytest.raises(TaskStateIsNotValid):
        service_tasks.update_state_task(1, -1)
        print("Error")

@then("se guarda el cambio de estado de la tarea")
def step_impl(session):
    service_tasks = TaskService(session)
    task_test = service_tasks.get_task(1)
    assert task_test.state == StateTask.EN_PROGRESO

@then("no se guarda el cambio de estado de la tarea")
def step_impl(session):
    service_tasks = TaskService(session)
    task_test = service_tasks.get_task(1)
    assert task_test.state == StateTask.NUEVO