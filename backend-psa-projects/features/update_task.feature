Feature: Actualizar tareas para el desarrollo del proyecto

  Scenario: Actualizar tareas antes de comenzar el proyecto
    Given que no existe el proyecto con id 1
    When se intentan actualizar tareas para ese proyecto
    Then no se actualizan las tareas porque no existen

  Scenario: Actualizar tareas antes de crear tareas
    Given que existe el proyecto con id 1 y no tiene tareas asociadas
    When se intenta actualizar la tarea con id 1
    Then no se actualizan las tareas porque no existen

  Scenario: Actualizar tareas sin empleado
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas sin asignar un empleado a estas
    Then no se actualizan las tareas

  Scenario: Actualizar tareas sin nombre
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas sin asignar un nombre a estas
    Then no se actualizan las tareas

  Scenario: Actualizar tareas sin fecha de inicio
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas sin asignar una fecha de inicio a estas
    Then no se actualizan las tareas

  Scenario: Actualizar tareas sin fecha de fin
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas sin asignar una fecha de fin a estas
    Then no se actualizan las tareas

  Scenario: Actualizar tareas con prioridad invalida
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con prioridad invalida
    Then no se actualizan las tareas

  Scenario: Actualizar tareas con estado invalido
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con estado invalido
    Then no se actualizan las tareas

  Scenario: Actualizar tarea con fecha de inicio posterior a fecha de fin 
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con fecha de inicio posterior a la fecha de fin
    Then no se actualizan las tareas

  Scenario: Actualizar tarea con fecha de inicio previa a fecha de inicio del proyecto  
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con fecha de inicio previa a la fecha de inicio del proyecto
    Then no se actualizan las tareas

  Scenario: Actualizar tarea con fecha de fin posterior a fecha de fin del proyecto 
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con fecha de fin posterior a la fecha de fin del proyecto
    Then no se actualizan las tareas

  Scenario: Actualizar tarea con fecha de fin previa a fecha de inicio del proyecto 
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con fecha de fin previa a la fecha de inicio del proyecto
    Then no se actualizan las tareas

  Scenario: Actualizar tarea con fecha de inicio posterior a fecha de fin del proyecto
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con fecha de inicio posterior a la fecha de fin del proyecto
    Then no se actualizan las tareas

  Scenario: Actualizar tareas con atributos validos
    Given que existe el proyecto con id 1 y tiene la tarea con id 1 asociada
    When se intentan actualizar tareas con atributos validos
    Then se actualizan las tareas