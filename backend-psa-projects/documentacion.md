# Documentación

## Objetos

```
StateProject (type Enum):
    NUEVO = 0
    EN_PROGRESO = 1
    ESPERANDO_CLIENTE = 2
    ESPERANDO_DESARROLLO = 3
    RESUELTO_ESPERANDO_CONFIRMACION = 4
    BLOQUEADO = 5
    CERRADO = 6

Project:
    name: str
    file_leader: int
    start_date: date
    end_date: date
    estimated_hours: int
    state: Optional[StateProject] = StateProject.NUEVO 
    
StateTask (type Enum):
    NUEVO = 0
    EN_PROGRESO = 1
    BLOQUEADO = 2
    CERRADO = 3

PriorityTask (type Enum):
    BAJA = 0
    MEDIA = 1
    ALTA = 2

Task:
    project_id: int
    name: str
    priority: PriorityTask
    file_foreman: int
    state: Optional[StateTask] = StateTask.NUEVO
    start_date: date
    end_date: date
```

## Endpoints

- ```get("/projects")```

Devuelve todos los proyectos existentes en el sistema.

- ```post("/projects")```

Recibe un objeto Project, realiza todas las verificaciones sobre los atributos de el mismo.

Si hay algún error lo lanza, si no lo hay lo guarda en la base de datos.

- ```get("/projects/{project_id}")```

Recibe un id y verifica si existe un proyecto en la base de datos con este. 

Si existe lo devuelve, en caso contrario lanza un error 404.

- ```delete("/projects/{project_id}")```

Recibe un id y verifica si existe el proyecto en la base de datos con este.

Si existe, elimina las tareas asociadas a este (de existir), elimina las asociaciones de las tareas con tickets (de existir), y filanmente elimina el proyecto de la base y lo devuelve. Caso contrario lanza un error 404.

- ```put("/projects/update_project/{project_id}")```

Recibe un id y un objeto Project, y verifica si existe el proyecto en la base de datos con este id. 

Si existe y el objeto Project tiene datos válidos, se actualiza en la base el proyecto con el id con los datos del nuevo Project y devuelve el Project actualizado. 

Si no existe un proyecto con el id se lanza un error 404. 

Si hay algun dato inválido se lanza un error 400.

- ```put("/projects/update_state_project/{project_id}")```

Recibe un id y un enum de tipo StateProject.

Si existe el proyecto con el id y el estado es válido, actualiza el estado en la base de datos.

Si no existe el proyecto lanza un error 404.

Si el estado es inválido lanza un error 400.

- ```post("/projects/{project_id}/create_task/")```

Recibe un id y un objeto tarea.

Si existe el proyecto con el id y la tarea posee todos campos válidos, agrega la tarea a la base de datos y la devuelve.

Si no existe el proyecto lanza un error 404.

Si la tarea posee un campo inválido lanza un error 400.

- ```get("/projects/{project_id}/get_tasks/")```

Recibe un id.

Si existe el proyecto con el id, devuelve todas las tareas asociadas a este.

Si no existe el proyecto lanza un error 404.

- ```get("/projects/get_task/{task_id}/")```

Recibe un id.

Si existe la tarea con el id, devuelve la tarea.

Si no existe la tarea lanza un error 404.

- ```put("/projects/update_task/{task_id}/")```

Recibe un id y un objeto Tarea.

Si existe la tarea con el id y la tarea nueva posee todos campos válidos, actualiza la tarea en la base de datos y la devuelve.

Si no existe la tarea lanza un error 404.

Si la tarea nueva posee un campo inválido lanza un error 400.

- ```put("/projects/update_state_task/{task_id}/")```

Recibe un id y un estado tarea.

Si existe la tarea con el id y el estado tarea es válido, actualiza la tarea en la base de datos y la devuelve.

Si no existe la tarea lanza un error 404.

Si el estado tarea es inválido lanza un error 400.

- ```put("/projects/update_priority_task/{task_id}/")```

Recibe un id y una prioridad tarea.

Si existe la tarea con el id y la prioridad tarea es válido, actualiza la tarea en la base de datos y la devuelve.

Si no existe la tarea lanza un error 404.

Si la prioridad tarea es inválido lanza un error 400.

- ```delete("/projects/delete_task/{task_id}/")```

Recibe un id.

Si existe la tarea con el id, borra las asociaciones con tickets (de existir), y finalmente la borra de la base de datos y la devuelve.

Si no existe la tarea lanza un error 404.

- ```get("/foremans")```

Devuelve los trabajadores que otorga la API externa de PSA en un archivo JSON.

