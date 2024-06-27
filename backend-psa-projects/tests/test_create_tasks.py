from pytest_bdd import scenario, given, when, then
import pytest
from models import project, task
from service.projects_service import *
from service.tasks_service import *
from  pydantic_core import ValidationError
from datetime import datetime, timedelta
from constants import *

@scenario("../features/create_task.feature", "Crear tareas antes de comenzar el proyecto")
def test_without_project():
    pass

@scenario("../features/create_task.feature", "Crear tareas sin empleado")
def test_without_foreman():
    pass

@scenario("../features/create_task.feature", "Crear tareas sin nombre")
def test_without_name():
    pass

@scenario("../features/create_task.feature", "Crear tareas sin fecha de inicio")
def test_without_start_date():
    pass

@scenario("../features/create_task.feature", "Crear tareas sin fecha de fin")
def test_without_end_date():
    pass

@scenario("../features/create_task.feature", "Crear tareas con prioridad invalida")
def test_invalid_priority():
    pass

@scenario("../features/create_task.feature", "Crear tareas con estado invalido")
def test_invalid_state():
    pass

@scenario("../features/create_task.feature", "Crear tarea con fecha de inicio posterior a fecha de fin")
def test_start_date_task_greater_than_end_date_task():
    pass

@scenario("../features/create_task.feature", "Crear tarea con fecha de inicio previa a fecha de inicio del proyecto")
def test_start_date_task_lesser_start_date_project():
    pass

@scenario("../features/create_task.feature", "Crear tarea con fecha de fin posterior a fecha de fin del proyecto")
def test_end_date_task_greater_end_date_project():
    pass


@scenario("../features/create_task.feature", "Crear tareas con atributos validos")
def test_valid():
    pass


@given("que no existe el proyecto con id 1")
def without_project_setup(session):
    # project not added
    pass


@given("que existe el proyecto con id 1")
def with_project_setup(session):
    ProjectService(session).save_project(project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    ))

@when("se intentan crear tareas para ese proyecto")
def create_task_without_project(session):
    task_test = task.Task(
        project_id = 1,
        name=NAME_TASK_1,
        priority=PRIORITY_TASK_1,
        file_foreman=FILE_FOREMAN_TASK_1,
        start_date=START_DATE_TASK_1,
        end_date=END_DATE_TASK_1,
    )

    with pytest.raises(ProjectNotFound):
        TaskService(session).create_task(task_test)

@when("se intentan crear tareas sin asignar un empleado a estas")
def not_foreman(session):
    with pytest.raises(ValidationError):
        TaskService(session).create_task(task.Task(
            project_id = 1,
            name=NAME_TASK_1,
            priority=PRIORITY_TASK_1,
            start_date=START_DATE_TASK_1,
            end_date=END_DATE_TASK_1,
        ))

@when("se intentan crear tareas sin asignar un nombre a estas")
def not_name(session):
    with pytest.raises(ValidationError):
        TaskService(session).create_task(task.Task(
            project_id = 1,
            priority=PRIORITY_TASK_1,
            start_date=START_DATE_TASK_1,
            end_date=END_DATE_TASK_1,
        ))

@when("se intentan crear tareas sin asignar una fecha de inicio a estas")
def not_start_date(session):
    with pytest.raises(ValidationError):
        TaskService(session).create_task(task.Task(
            project_id = 1,
            name=NAME_TASK_1,
            priority=PRIORITY_TASK_1,
            file_foreman=FILE_FOREMAN_TASK_1,
            end_date=END_DATE_TASK_1,
        ))

@when("se intentan crear tareas sin asignar una fecha de fin a estas")
def not_end_date(session):
    with pytest.raises(ValidationError):
        TaskService(session).create_task(task.Task(
            project_id = 1,
            name=NAME_TASK_1,
            priority=PRIORITY_TASK_1,
            file_foreman=FILE_FOREMAN_TASK_1,
            end_date=END_DATE_TASK_1,
        ))

@when("se intentan crear tareas con prioridad invalida")
def invalid_priority(session):
    with pytest.raises(ValidationError):
        TaskService(session).create_task(task.Task(
            project_id = 1,
            name=NAME_TASK_1,
            file_foreman=FILE_FOREMAN_TASK_1,
            priority=100,
            start_date=START_DATE_TASK_1,
            end_date=END_DATE_TASK_1,
        ))

@when("se intentan crear tareas con estado invalido")
def invalid_state(session):
    with pytest.raises(ValidationError):
        TaskService(session).create_task(task.Task(
            project_id = 1,
            name=NAME_TASK_1,
            file_foreman=FILE_FOREMAN_TASK_1,
            priority=PRIORITY_TASK_1,
            start_date=START_DATE_TASK_1,
            end_date=END_DATE_TASK_1,
            state=100
        ))

@when("se intentan crear tareas con fecha de inicio posterior a la fecha de fin")
def start_date_task_greater_than_end_date_task(session):
    task_test = task.Task(
        project_id = 1,
        name=NAME_TASK_1,
        file_foreman=FILE_FOREMAN_TASK_1,
        priority=PRIORITY_TASK_1,
        start_date=END_DATE_TASK_1,
        end_date=START_DATE_TASK_1
    )

    task_service = TaskService(session)
    with pytest.raises(StartDateTaskGreaterThanEndDateTask):
        task_service.create_task(task_test)

@when("se intentan crear tareas con fecha de inicio previa a la fecha de inicio del proyecto")
def start_date_task_lesser_than_start_date_project(session): 
    task_test = task.Task(
        project_id = 1,
        name=NAME_TASK_1,
        file_foreman=FILE_FOREMAN_TASK_1,
        priority=PRIORITY_TASK_1,
        start_date=(datetime.strptime(START_DATE_PROJECT_1, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d"),
        end_date=END_DATE_TASK_1
    )

    task_service = TaskService(session)
    with pytest.raises(StartDateTaskLessThanStartDateProject):
        task_service.create_task(task_test)

@when("se intentan crear tareas con fecha de fin posterior a la fecha de fin del proyecto")
def end_date_task_greater_than_end_date_project(session):
    task_test = task.Task(
        project_id = 1,
        name=NAME_TASK_1,
        file_foreman=FILE_FOREMAN_TASK_1,
        priority=PRIORITY_TASK_1,
        start_date=START_DATE_TASK_1,
        end_date=(datetime.strptime(END_DATE_PROJECT_1, "%Y-%m-%d") + timedelta(days=1)).strftime("%Y-%m-%d")
    )

    task_service = TaskService(session)
    with pytest.raises(EndDateTaskGreaterThanEndDateProject):
        task_service.create_task(task_test)

@when("se intentan crear tareas con atributos validos")
def valids_atributes(session):
    task_test = task.Task(
        project_id = 1,
        name=NAME_TASK_1,
        priority=PRIORITY_TASK_1,
        file_foreman=FILE_FOREMAN_TASK_1,
        start_date=START_DATE_TASK_1,
        end_date=END_DATE_TASK_1,
    )
    TaskService(session).create_task(task_test)

@then(u"no se crean las tareas")
def step_impl(session):
    with pytest.raises(TaskNotFound):
        TaskService(session).get_task(1)


@then(u"se crean las tareas")
def step_impl(session):
    task = TaskService(session).get_task(1)
    assert task is not None
    assert task.project_id == 1
    assert task.name == NAME_TASK_1
    assert task.priority == PRIORITY_TASK_1
    assert task.file_foreman == FILE_FOREMAN_TASK_1
    assert task.start_date == datetime.strptime(START_DATE_TASK_1, "%Y-%m-%d").date()
    assert task.end_date == datetime.strptime(END_DATE_TASK_1, "%Y-%m-%d").date()
