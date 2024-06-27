from pytest_bdd import scenario, given, when, then
import pytest
from models import project, task
from service.projects_service import *
from  pydantic_core import ValidationError
from datetime import datetime
from constants import *

get_projects_exists = None
get_projects_non_exists = None

@scenario("../features/project_dashboard.feature", "Ver el estado de proyectos creados")
def test_get_projects():
    pass

@scenario("../features/project_dashboard.feature", "No hay proyectos creados para ver")
def test_no_projects():
    pass

@given("que existe el proyecto con id 1 y 2")
def projects_setup(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_test2 = project.Project(
        name=NAME_PROJECT_2,
        file_leader=FILE_LEADER_PROJECT_2,
        start_date=START_DATE_PROJECT_2,
        end_date=END_DATE_PROJECT_2,
        estimated_hours=ESTIMATED_HOURS_PROJECT_2
    )


    project_service = ProjectService(session)
    project_service.save_project(project_test)
    project_service.save_project(project_test2)

@given("que no hay proyectos creados")
def no_projects(session):
    pass

@when("hago el get de proyectos existentes")
def get_exists(session):
    pass

@when("hago el get de proyectos no existentes")
def get_dont_exists(session):
        pass

@then("el sistema me devuelve los proyectos 1 y 2")
def step_impl(session):
    get_projects_exists = ProjectService(session).get_projects()
    assert len(get_projects_exists) == 2
    assert get_projects_exists[0].project_id == 1
    assert get_projects_exists[1].project_id == 2
    assert get_projects_exists[0].name == NAME_PROJECT_1
    assert get_projects_exists[1].name == NAME_PROJECT_2
    assert get_projects_exists[0].file_leader == FILE_LEADER_PROJECT_1
    assert get_projects_exists[1].file_leader == FILE_LEADER_PROJECT_2
    assert get_projects_exists[0].start_date == datetime.strptime(START_DATE_PROJECT_1, "%Y-%m-%d").date()
    assert get_projects_exists[1].start_date ==  datetime.strptime(START_DATE_PROJECT_2, "%Y-%m-%d").date()
    assert get_projects_exists[0].end_date ==  datetime.strptime(END_DATE_PROJECT_1, "%Y-%m-%d").date()
    assert get_projects_exists[1].end_date ==  datetime.strptime(END_DATE_PROJECT_2, "%Y-%m-%d").date()
    assert get_projects_exists[0].estimated_hours == ESTIMATED_HOURS_PROJECT_1
    assert get_projects_exists[1].estimated_hours == ESTIMATED_HOURS_PROJECT_2

@then("el sistema informa que no hay proyectos creados")
def step_impl(session):
    projects = ProjectService(session).get_projects()
    assert projects == []
