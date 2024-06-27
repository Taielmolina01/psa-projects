Feature: Ver los proyectos creados

  Scenario: Ver el estado de proyectos creados
    Given que existe el proyecto con id 1 y 2
    When hago el get de proyectos existentes
    Then el sistema me devuelve los proyectos 1 y 2

  Scenario: No hay proyectos creados para ver
    Given que no hay proyectos creados
    When hago el get de proyectos no existentes
    Then el sistema informa que no hay proyectos creados