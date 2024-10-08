Feature: Crear un proyecto

  Scenario: Crear proyecto con datos validos
    Given que se intentan crear proyectos
    When se asignan atributos validos a estos
    Then se crean los proyectos

  Scenario: Crear proyecto con tiempo negativo o nulo
    Given que se intentan crear proyectos
    When se les asignan valores negativos o nulos a las horas estimadas de estos
    Then no se crean los proyectos

  Scenario: Crear proyecto sin lider
    Given que se intentan crear proyectos
    When no se les asignan lideres a estos
    Then no se crean los proyectos

  Scenario: Crear proyecto sin nombre
    Given que se intentan crear proyectos
    When no se les asignan nombres a estos
    Then no se crean los proyectos

  Scenario: Crear proyecto con estado invalido
    Given que se intentan crear proyectos
    When se les asigna un estado invalido a estos
    Then no se crean los proyectos

  Scenario: Crear proyecto sin fecha de inicio
    Given que se intentan crear proyectos
    When no se les asignan una fecha de inicio a estos
    Then no se crean los proyectos

  Scenario: Crear proyecto sin fecha de fin
    Given que se intentan crear proyectos
    When no se les asignan una fecha de fin a estos
    Then no se crean los proyectos

  Scenario: Crear proyecto con fecha de inicio posterior a fecha de fin
    Given que se intentan crear proyectos
    When se asignan fechas de inicio posteriores a las fechas de fin de estos
    Then no se crean los proyectos
