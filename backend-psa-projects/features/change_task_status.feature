
Feature: Cambiar el estado de una tarea

  Scenario: Cambiar y guardar el estado de una tarea
    Given que hay un proyecto con una tarea en estado nuevo
    When cambio el estado de la tarea a en progreso
    Then se guarda el cambio de estado de la tarea

  Scenario: No guardar cambio de estado de una tarea si no hay cambios
    Given que hay un proyecto con una tarea en estado nuevo
    When cambio el estado de la tarea a nuevo
    Then no se guarda el cambio de estado de la tarea

  Scenario: No guardar cambio de estado de una tarea si es invalido
    Given que hay un proyecto con una tarea en estado nuevo
    When el nuevo estado de la tarea es invalido
    Then no se guarda el cambio de estado de la tarea