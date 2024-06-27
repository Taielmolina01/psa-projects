Feature: Crear tareas para el desarrollo del proyecto

  Scenario: Crear tareas antes de comenzar el proyecto
    Given que no existe el proyecto con id 1
    When se intentan crear tareas para ese proyecto
    Then no se crean las tareas

  Scenario: Crear tareas sin empleado
    Given que existe el proyecto con id 1
    When se intentan crear tareas sin asignar un empleado a estas
    Then no se crean las tareas

  Scenario: Crear tareas sin nombre
    Given que existe el proyecto con id 1
    When se intentan crear tareas sin asignar un nombre a estas
    Then no se crean las tareas

  Scenario: Crear tareas sin fecha de inicio
    Given que existe el proyecto con id 1
    When se intentan crear tareas sin asignar una fecha de inicio a estas
    Then no se crean las tareas

  Scenario: Crear tareas sin fecha de fin
    Given que existe el proyecto con id 1
    When se intentan crear tareas sin asignar una fecha de fin a estas
    Then no se crean las tareas

  Scenario: Crear tareas con prioridad invalida
    Given que existe el proyecto con id 1
    When se intentan crear tareas con prioridad invalida
    Then no se crean las tareas

  Scenario: Crear tareas con estado invalido
    Given que existe el proyecto con id 1
    When se intentan crear tareas con estado invalido
    Then no se crean las tareas

  Scenario: Crear tarea con fecha de inicio posterior a fecha de fin 
    Given que existe el proyecto con id 1
    When se intentan crear tareas con fecha de inicio posterior a la fecha de fin
    Then no se crean las tareas

  Scenario: Crear tarea con fecha de inicio previa a fecha de inicio del proyecto  
    Given que existe el proyecto con id 1
    When se intentan crear tareas con fecha de inicio previa a la fecha de inicio del proyecto
    Then no se crean las tareas

  Scenario: Crear tarea con fecha de fin posterior a fecha de fin del proyecto 
    Given que existe el proyecto con id 1
    When se intentan crear tareas con fecha de fin posterior a la fecha de fin del proyecto
    Then no se crean las tareas

  Scenario: Crear tarea con fecha de fin previa a fecha de inicio del proyecto 
    Given que existe el proyecto con id 1
    When se intentan crear tareas con fecha de fin previa a la fecha de inicio del proyecto
    Then no se crean las tareas

  Scenario: Crear tarea con fecha de inicio posterior a fecha de fin del proyecto
    Given que existe el proyecto con id 1
    When se intentan crear tareas con fecha de inicio posterior a la fecha de fin del proyecto
    Then no se crean las tareas

  Scenario: Crear tareas con atributos validos
    Given que existe el proyecto con id 1
    When se intentan crear tareas con atributos validos
    Then se crean las tareas