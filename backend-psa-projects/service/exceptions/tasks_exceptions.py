MESSAGE_TASK_NOT_FOUND = "La tarea de id {task_id} no existe."
MESSAGE_TASK_NOT_HAVE_NAME = "La tarea debe tener un nombre."
MESSAGE_TASK_NOT_HAVE_REQUIREMENTS = "La tarea debe tener ciertos requirimientos."
MESSAGE_TASK_NOT_HAVE_FOREMAN = "La tarea debe tener una persona a cargo."
MESSAGE_STATE_OF_TASK_IS_NOT_VALID = "Elija un estado de tarea válido."
MESSAGE_NEW_STATE_IS_ACTUAL_STATE = "La tarea ya se encuentra en ese estado."
MESSAGE_TASK_NOT_HAVE_START_DATE = "La tarea debe poseer una fecha de inicio."
MESSAGE_TASK_NOT_HAVE_END_DATE = "La tarea debe poseer una fecha de fin."
MESSAGE_START_DATE_GREATER_THAN_END_DATE = "La fecha de inicio de una tarea no puede ser mayor a su fecha de fin."
MESSAGE_START_DATE_TASK_LESS_THAN_START_DATE_PROJECT = "La fecha de inicio de la tarea no puede ser menor a la fecha de inicio del proyecto."
MESSAGE_END_DATE_TASK_GREATER_THAN_END_DATE_PROJECT = "La fecha de fin de la tarea no puede ser mayor a la fecha de fin del proyecto."
MESSAGE_PRIORITY_OF_TASK_IS_NOT_VALID = "La prioridad de la tarea no es válida: {priority}."
MESSAGE_FOREMAN_TASK_NOT_REGISTERED = "El numero de legajo no pertenece a un trabador registrado."

class TaskWithoutName(Exception):
    def __init__(self):
        self.message = MESSAGE_TASK_NOT_HAVE_NAME
        super().__init__(self.message)

class TaskWithoutRequirements(Exception):
    def __init__(self):
        self.message = MESSAGE_TASK_NOT_HAVE_REQUIREMENTS
        super().__init__(self.message)

class TaskPriorityIsNotValid(Exception):
    def __init__(self, priority):
        self.message = MESSAGE_PRIORITY_OF_TASK_IS_NOT_VALID.format(priority=priority)
        super().__init__(self.message)

class TaskWithoutForeman(Exception):
    def __init__(self):
        self.message = MESSAGE_TASK_NOT_HAVE_FOREMAN
        super().__init__(self.message)

class ForemanTaskNotRegistered(Exception):
    def __init__(self):
        self.message = MESSAGE_FOREMAN_TASK_NOT_REGISTERED
        super().__init__(self.message)

class TaskStateIsNotValid(Exception):
    def __init__(self, state):
        self.message = MESSAGE_STATE_OF_TASK_IS_NOT_VALID.format(state=state)
        super().__init__(self.message)

class TaskNotFound(Exception):
    def __init__(self, task_id: int):
        self.task_id = task_id
        self.message = MESSAGE_TASK_NOT_FOUND.format(task_id=task_id)
        super().__init__(self.message)

class TaskHaveNotStartDate(Exception):
    def __init__(self):
        self.message = MESSAGE_TASK_NOT_HAVE_START_DATE
        super().__init__(self.message)

class TaskHaveNotEndDate(Exception):
    def __init__(self):
        self.message = MESSAGE_TASK_NOT_HAVE_END_DATE
        super().__init__(self.message)

class StartDateTaskGreaterThanEndDateTask(Exception):
    def __init__(self):
        self.message = MESSAGE_START_DATE_GREATER_THAN_END_DATE
        super().__init__(self.message)

class StartDateTaskLessThanStartDateProject(Exception): 
    def __init__(self):
        self.message = MESSAGE_START_DATE_TASK_LESS_THAN_START_DATE_PROJECT
        super().__init__(self.message)

class EndDateTaskGreaterThanEndDateProject(Exception): 
    def __init__(self):
        self.message = MESSAGE_END_DATE_TASK_GREATER_THAN_END_DATE_PROJECT
        super().__init__(self.message)