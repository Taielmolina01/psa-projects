from pytest_bdd import scenario, given, when, then
import pytest
from models import project, task
from service.projects_service import *
from  pydantic_core import ValidationError
from datetime import datetime
from constants import *

@scenario("../features/update_project.feature", "Actualizar proyecto con datos validos")
def test_update_project():
    pass

@scenario("../features/update_project.feature", "Actualizar proyecto con tiempo negativo o nulo")
def test_update_project_bad_hours():
    pass

@scenario("../features/update_project.feature", "Actualizar proyecto sin lider")
def test_update_project_without_leader():
    pass

@scenario("../features/update_project.feature", "Actualizar proyecto sin nombre")
def test_update_project_without_name():
    pass

@scenario("../features/update_project.feature", "Actualizar proyecto sin fecha de inicio")
def test_update_project_without_start_date():
    pass

@scenario("../features/update_project.feature", "Actualizar proyecto sin fecha de fin")
def test_update_project_without_end_date():
    pass

@scenario("../features/update_project.feature", "Actualizar proyecto con fecha de inicio posterior a fecha de fin")
def test_update_project_without_name():
    pass

@scenario("../features/update_project.feature", "Actualizar proyecto con estado invalido")
def test_update_project_invalid_state():
    pass


@given(u"que se intentan actualizar proyectos")
def okay(session):
    pass

@when("se asignan atributos validos a estos")
def valid_project(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)

    project_test_update = project.Project(
        name=NAME_PROJECT_2,
        file_leader=FILE_LEADER_PROJECT_2,
        start_date=START_DATE_PROJECT_2,
        end_date=END_DATE_PROJECT_2,
        estimated_hours=ESTIMATED_HOURS_PROJECT_2
    )

    project_service = ProjectService(session)
    project_service.update_project(1, project_test_update)

@when(u"se les asignan valores negativos o nulos a las horas estimadas de estos")
def negative_hours(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)

    project_test_update = project.Project(
        name=NAME_PROJECT_2,
        file_leader=FILE_LEADER_PROJECT_2,
        start_date=START_DATE_PROJECT_2,
        end_date=END_DATE_PROJECT_2,
        estimated_hours=-100
    )

    with pytest.raises(ProjectHaveInvalidEstimatedHours):
        project_service.update_project(1, project_test_update)

@when(u"no se les asignan lideres a estos")
def not_leader(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)

    with pytest.raises(ValidationError):
        project_update_test = project.Project(
            name=NAME_PROJECT_1,
            start_date=START_DATE_PROJECT_1,
            end_date=END_DATE_PROJECT_1,
            estimated_hours=100
        )

@when(u"no se les asignan nombres a estos")
def not_name(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)

    with pytest.raises(ValidationError):
        project_update_test = project.Project(
            file_leader=FILE_LEADER_PROJECT_1,
            start_date=START_DATE_PROJECT_1,
            end_date=END_DATE_PROJECT_1,
            estimated_hours=100
        )

@when(u"se les asigna un estado invalido a estos")
def invalid_state(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)

    with pytest.raises(ValidationError):
        project_update_test = project.Project(
            name=NAME_PROJECT_1,
            file_leader=FILE_LEADER_PROJECT_1,
            start_date=START_DATE_PROJECT_1,
            end_date=END_DATE_PROJECT_1,
            estimated_hours=100,
            state=400
        )

@when(u"no se les asignan una fecha de inicio a estos")
def not_start_date(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)

    with pytest.raises(ValidationError):
        project_update_test = project.Project(
            name=NAME_PROJECT_1,
            file_leader=FILE_LEADER_PROJECT_1,
            end_date=END_DATE_PROJECT_1,
            estimated_hours=100,
            state=400
        )

@when(u"no se les asignan una fecha de fin a estos")
def not_end_date(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)    

    with pytest.raises(ValidationError):
        project_update_test = project.Project(
            name=NAME_PROJECT_1,
            file_leader=FILE_LEADER_PROJECT_1,
            start_date=START_DATE_PROJECT_1,
            estimated_hours=100,
            state=400
        )

@when(u"se asignan fechas de inicio posteriores a las fechas de fin de estos")
def start_date_greater_than_end_date(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    project_service.save_project(project_test)

    project_update_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=END_DATE_PROJECT_1,
        end_date=START_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )

    project_service = ProjectService(session)
    with pytest.raises(StartDateProjectGreaterThanEndDateProject):
        project_service.update_project(1, project_update_test)

@then(u"no se actualizan los proyectos")
def not_creates_proyecto(session):
    project_service = ProjectService(session)
    project_test = project_service.get_project(1)
    assert project_test is not None
    assert project_test.name == NAME_PROJECT_1
    assert project_test.file_leader == FILE_LEADER_PROJECT_1
    assert project_test.start_date == datetime.strptime(START_DATE_PROJECT_1, "%Y-%m-%d").date()
    assert project_test.end_date == datetime.strptime(END_DATE_PROJECT_1, "%Y-%m-%d").date()
    assert project_test.estimated_hours == ESTIMATED_HOURS_PROJECT_1
    assert project_test.state == project.StateProject.NUEVO

@then(u"se actualizan los proyectos")
def creates_proyecto(session):
    project_service = ProjectService(session)
    project_test = project_service.get_project(1)
    assert project_test is not None
    assert project_test.name == NAME_PROJECT_2
    assert project_test.file_leader == FILE_LEADER_PROJECT_2
    assert project_test.start_date == datetime.strptime(START_DATE_PROJECT_2, "%Y-%m-%d").date()
    assert project_test.end_date == datetime.strptime(END_DATE_PROJECT_2, "%Y-%m-%d").date()
    assert project_test.estimated_hours == ESTIMATED_HOURS_PROJECT_2
    assert project_test.state == project.StateProject.NUEVO