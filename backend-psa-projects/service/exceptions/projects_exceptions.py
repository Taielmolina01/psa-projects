MESSAGE_PROJECT_NOT_FOUND = "El proyecto de id {project_id} no existe."
MESSAGE_PROJECT_HAVE_NOT_NAME = "El proyecto debe tener un nombre."
MESSAGE_PROJECT_HAVE_NOT_LEADER = "El proyecto debe tener un lider."
MESSAGE_PROJECT_HAVE_INVALID_ESTIMATED_HOURS = "El proyecto no puede tener una duración estimada nula o negativa."
MESSAGE_STATE_OF_PROJECT_IS_NOT_VALID = "Elija un estado de proyecto válido."
MESSAGE_LEADER_PROJECT_NOT_REGISTERED = "El numero de legajo no pertenece a un trabador registrado."
MESSAGE_START_DATE_GREATER_THAN_END_DATE = "La fecha de inicio de un proyecto no puede ser mayor a su fecha de fin."
MESSAGE_PROJECT_HAVE_NOT_START_DATE = "El proyecto debe poseer una fecha de inicio."
MESSAGE_PROJECT_HAVE_NOT_END_DATE = "El proyecto debe poseer una fecha de fin."

class ProjectNotFound(Exception):
    def __init__(self, project_id: int):
        self.project_id = project_id
        self.message = MESSAGE_PROJECT_NOT_FOUND.format(project_id=project_id)
        super().__init__(self.message)

class ProjectHaveNotName(Exception):
    def __init__(self):
        self.message = MESSAGE_PROJECT_HAVE_NOT_NAME
        super().__init__(self.message)

class ProjectHaveNotLeader(Exception):
    def __init__(self):
        self.message = MESSAGE_PROJECT_HAVE_NOT_LEADER
        super().__init__(self.message)

class LeaderProjectNotRegistered(Exception):
    def __init__(self):
        self.message = MESSAGE_LEADER_PROJECT_NOT_REGISTERED
        super().__init__(self.message)

class ProjectHaveInvalidEstimatedHours(Exception):
    def __init__(self):
        self.message = MESSAGE_PROJECT_HAVE_INVALID_ESTIMATED_HOURS
        super().__init__(self.message)

class StateOfProjectIsNotValid(Exception):
    def __init__(self):
        self.message = MESSAGE_STATE_OF_PROJECT_IS_NOT_VALID
        super().__init__(self.message)

class ProjectHaveNotStartDate(Exception):
    def __init__(self):
        self.message = MESSAGE_PROJECT_HAVE_NOT_START_DATE
        super().__init__(self.message)

class ProjectHaveNotEndDate(Exception):
    def __init__(self):
        self.message = MESSAGE_PROJECT_HAVE_NOT_END_DATE
        super().__init__(self.message)

class StartDateProjectGreaterThanEndDateProject(Exception):
    def __init__(self):
        self.message = MESSAGE_START_DATE_GREATER_THAN_END_DATE
        super().__init__(self.message)