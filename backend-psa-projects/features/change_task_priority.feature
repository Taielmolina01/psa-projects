Feature: Cambiar la prioridad de una tarea

  Scenario: Cambiar y guardar la prioridad de una tarea
    Given que hay un proyecto con una tarea con prioridad baja
    When cambio la prioridad de la tarea a media
    Then se guarda el cambio de prioridad de la tarea

  Scenario: No guardar cambio de prioridad de una tarea si no hay cambios
    Given que hay un proyecto con una tarea con prioridad baja
    When cambio la prioridad de la tarea a baja
    Then no se guarda el cambio de prioridad de la tarea

  Scenario: No guardar cambio de prioridad de una tarea si es invalido
    Given que hay un proyecto con una tarea con prioridad baja
    When la nueva prioridad de la tarea es invalida
    Then no se guarda el cambio de prioridad de la tarea