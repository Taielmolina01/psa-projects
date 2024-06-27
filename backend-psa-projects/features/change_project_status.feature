Feature: Cambiar estado de un proyecto

Scenario: Guardar cambio de estado del proyecto
  Given hay un proyecto creado con estado: Nuevo
  When cambio el estado del proyecto a En Progreso
  Then se guarda el cambio de estado del proyecto a En Progreso

Scenario: No guardar cambio de estado del proyecto si no hay cambios
  Given hay un proyecto creado con estado: Nuevo
  When cambio el estado del proyecto a Nuevo
  Then no se guarda el cambio de estado del proyecto

Scenario: No guardar cambio de estado del proyecto si es invalido
  Given hay un proyecto creado con estado: Nuevo
  When el nuevo estado del proyecto es invalido
  Then no se guarda el cambio de estado del proyecto
