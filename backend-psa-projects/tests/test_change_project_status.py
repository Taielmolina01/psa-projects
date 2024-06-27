from pytest_bdd import feature, scenario, given, when, then
import pytest
from models import project, task
from service.projects_service import *
from constants import *

@scenario("../features/change_project_status.feature", 'Guardar cambio de estado del proyecto')
def test_change_user_ok(session):
    pass

@scenario("../features/change_project_status.feature", 'No guardar cambio de estado del proyecto si es invalido')
def test_change_user_invalid(session):
    pass

@scenario("../features/change_project_status.feature", 'No guardar cambio de estado del proyecto si no hay cambios')
def test_change_user_no_change(session):
    pass



@given('hay un proyecto creado con estado: Nuevo')
def new_project(session):
    project_test = project.Project(
        name=NAME_PROJECT_1,
        file_leader=FILE_LEADER_PROJECT_1,
        start_date=START_DATE_PROJECT_1,
        end_date=END_DATE_PROJECT_1,
        estimated_hours=ESTIMATED_HOURS_PROJECT_1
    )
    service_projects = ProjectService(session)
    service_projects.save_project(project_test)


@when('cambio el estado del proyecto a En Progreso')
def change_state_to_in_progress(session):
    service_projects = ProjectService(session)
    service_projects.update_state_project(1, StateProject.EN_PROGRESO)


@when('cambio el estado del proyecto a Nuevo')
def change_state_to_new(session):
    service_projects = ProjectService(session)
    service_projects.update_state_project(1, StateProject.NUEVO)


@when('el nuevo estado del proyecto es invalido')
def change_state_invalid(session):
    service_projects = ProjectService(session)
    with pytest.raises(StateOfProjectIsNotValid):
        service_projects.update_state_project(1, -1)


@then('se guarda el cambio de estado del proyecto a En Progreso')
def validate_state_in_progress(session):
    project_service = ProjectService(session)
    project_test = project_service.get_project(1)
    assert project_test.state == project.StateProject.EN_PROGRESO



@then('no se guarda el cambio de estado del proyecto')
def validate_no_change(session):
    project_service = ProjectService(session)
    project_test = project_service.get_project(1)
    assert project_test.state == project.StateProject.NUEVO
