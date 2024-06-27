"use client";
import { ProjectType, TaskType } from "@/types";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Spinner from "../../spinner";
import { useRouter } from "next/navigation";

export default function Tasks({
  params: { projectId },
}: {
  params: { projectId: string };
}) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskType[]>([]);
  const [confirmDeletion, setConfirmDeletion] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [project, setProject] = useState<ProjectType | null>(null);
  const [foremansMap, setForemansMap] = useState<Map<number, string> | null>(
    null,
  );
  const urlBackSupport = "https://soporte-wyq6.onrender.com";

  useEffect(() => {
    setFilteredTasks((_filteredTasks) => {
      return tasks.filter((t) => _filteredTasks.includes(t));
    });
  }, [tasks]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/foremans`)
      .then((res) => res.json())
      .then((foremans) => {
        const legajoMap = new Map();
        foremans.forEach((item: any) => {
          legajoMap.set(item.legajo, `${item.Nombre} ${item.Apellido}`);
        });
        setForemansMap(legajoMap);
      })
      .catch((_) => console.log("Error fetching foremans"));

    fetch(`${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/projects/${projectId}`)
      .then((res) => res.json())
      .then((project) => setProject(project))
      .catch((_) => console.log("Error fetching foremans"));

    fetch(
      `${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/projects/${projectId}/get_tasks/`,
    )
      .then((res) => res.json())
      .then((data: any) => {
        setTasks(data as TaskType[]);
        setFilteredTasks(data as TaskType[]);
      })
      .then(() => setLoading(false))
      .catch((_) => console.log("Error fetching tasks"));
  }, []);

  const handleSearchFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const filter = tasks.filter((t) => t.name.includes(e.target.value));

    if (document.startViewTransition) {
      document.startViewTransition(() => setFilteredTasks(filter));
    } else {
      setFilteredTasks(filter);
    }
  };

  const handleFilter = (e: any) => {
    e.preventDefault();

    if (e.target.value === "-1") {
      setFilteredTasks(tasks);
      return;
    }

    const filter = tasks.filter((t) => t.state == +e.target.value);

    if (document.startViewTransition) {
      document.startViewTransition(() => setFilteredTasks(filter));
    } else {
      setFilteredTasks(filter);
    }
  };

  const deleteTask = (taskId: number) => {
    fetch(`${urlBackSupport}/tareaTicket/tarea/${taskId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error deleting ticket associations");
        }
        return fetch(
          `${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/projects/delete_task/${taskId}`,
          {
            method: "DELETE",
          },
        );
      })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error deleting task");
        }
        const newTasks = tasks.filter((t) => t.id !== taskId);
        setTasks(newTasks);
        setFilteredTasks(newTasks);
        setConfirmDeletion(null);
      })
      .catch((error) => {
        console.error(error);
        console.log("Error deleting task");
      });
  };

  const confirmDelete = (taskId: number) => {
    setConfirmDeletion(taskId);
  };

  if (loading || !project || !foremansMap) {
    return (
      <div className="w-full py-5 max-w-3xl text-sm flex flex-col gap-2 transition-s items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="bg-gray-100 pt-5">
        <div className="max-w-3xl mx-auto text-sm flex flex-col gap-2 items-center pb-4">
          <h2 className="text-2xl font-bold text-gray-900">{project?.name}</h2>
          <h4 className="text-lg font-semibold text-gray-400">Proyecto</h4>
          <div className="w-full flex gap-3 justify-between">
            <input
              className="flex-grow border-2 rounded-md px-3 border-gray-200 hover:border-gray-500 focus:border-gray-500 focus:outline-none"
              type="text"
              placeholder="Encuentre una tarea"
              onChange={handleSearchFilter}
            />
            <select
              onChange={handleFilter}
              className="rounded-md py-2 pl-1 border-2 border-gray-200 bg-gray-100 outline-none hover:border-gray-300"
              defaultValue="-1"
            >
              <option value="-1">Sin filtro</option>
              <option value={0}>Nuevo</option>
              <option value={1}>En progreso</option>
              <option value={2}>Bloqueado</option>
              <option value={3}>Cerrado</option>
            </select>
          </div>
          <Link
            className="w-full border-2 border-sky-400 rounded-md text-sky-400 text-center py-1 hover:bg-sky-400 hover:text-white hover:font-bold"
            href={`/crear-tarea/${projectId}`}
          >
            + Agregar Tarea
          </Link>
          <TaskTable
            foremansMap={foremansMap}
            deleteTask={confirmDelete}
            tasks={filteredTasks}
            setTasks={setTasks}
          />
          {confirmDeletion != null && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-5 rounded-md">
                <h1 className="mb-3 font-bold">
                  ¿Estás seguro de que deseas eliminar esta tarea?
                </h1>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => deleteTask(confirmDeletion)}
                    className="bg-sky-400 hover:bg-sky-500 font-bold text-white px-3 py-2 rounded-md"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmDeletion(null)}
                    className="bg-red-400 hover:bg-red-500 font-bold text-white px-3 py-2 rounded-md"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TaskTable: React.FC<{
  tasks: TaskType[];
  deleteTask: (taskId: number) => void;
  foremansMap: Map<number, string>;
  setTasks: any;
}> = ({ tasks, deleteTask, foremansMap, setTasks }) => {
  const [openStateTask, setOpenStateTask] = useState<TaskType | null>(null);
  const [openPriorityTask, setOpenPriorityTask] = useState<TaskType | null>(
    null,
  );
  const router = useRouter();

  const editTask = (taskId: number) => {
    router.push(`/editar-tarea/${taskId}`);
  };

  return (
    <>
      <table className="w-full">
        <thead className="bg-sky-400 border-2 border-gray-100 flex text-white w-full rounded-md">
          <tr className="flex w-full">
            <th className="p-2 w-1/6 font-bold">Nombre</th>
            <th className="p-2 w-1/6 font-bold">Responsable</th>
            <th className="p-2 w-1/6 font-bold">Estado</th>
            <th className="p-2 w-1/6 font-bold">Prioridad</th>
            <th className="p-2 w-1/6 font-bold">Editar</th>
            <th className="p-2 w-1/6 font-bold">Eliminar</th>
          </tr>
        </thead>

        <tbody className="w-full font-normal">
          {tasks &&
            tasks.map((task, i) => {
              return (
                <tr
                  className="mb-1 flex items-center w-full border-2 border-gray-100 hover:border-gray-500 odd:bg-gray-300 even:bg-gray-100 transition-all cursor-pointer rounded-md"
                  key={i}
                >
                  <th className="p-2 w-1/6">{task.name}</th>
                  <th className="p-2 w-1/6">
                    {foremansMap.get(task.file_foreman)}
                  </th>
                  <th
                    className="p-2 w-1/6 hover:font-bold hover:underline"
                    onClick={() => setOpenStateTask(task)}
                  >
                    {(() => {
                      switch (task.state) {
                        case 0:
                          return "Nuevo";
                        case 1:
                          return "En progreso";
                        case 2:
                          return "Bloqueado";
                        case 3:
                          return "Cerrado";
                        default:
                          return "Desconocido";
                      }
                    })()}
                  </th>
                  <th
                    className="p-2 w-1/6 hover:font-bold hover:underline"
                    onClick={() => setOpenPriorityTask(task)}
                  >
                    {(() => {
                      switch (task.priority) {
                        case 0:
                          return "Baja";
                        case 1:
                          return "Media";
                        case 2:
                          return "Alta";
                        default:
                          return "Desconocido";
                      }
                    })()}
                  </th>
                  <th className="p-2 w-1/6 flex items center justify-center">
                    <div
                      onClick={() => editTask(task.id)}
                      id="edit-task"
                      className="cursor-pointer flex items-center justify-center text-base w-5 h-5 transform transition-transform duration-200 hover:scale-110 rounded-sm"
                    >
                      <img src="/pencil.png"></img>
                    </div>{" "}
                  </th>
                  <th className="p-2 w-1/6 flex items-center justify-center">
                    <div
                      onClick={() => deleteTask(task.id)}
                      id="delete-task"
                      className="cursor-pointer flex items-center justify-center text-base w-5 h-5 transform transition-transform duration-200 hover:scale-110 rounded-sm"
                    >
                      <img src="/trash.png"></img>
                    </div>{" "}
                  </th>
                </tr>
              );
            })}
        </tbody>
      </table>
      {openStateTask != null && (
        <PopUpState
          task={openStateTask}
          setOpen={setOpenStateTask}
          setTasks={setTasks}
        />
      )}
      {openPriorityTask != null && (
        <PopUpPriority
          task={openPriorityTask}
          setOpen={setOpenPriorityTask}
          setTasks={setTasks}
        />
      )}
    </>
  );
};

const PopUpState: React.FC<{ task: TaskType; setOpen: any; setTasks: any }> = ({
  task,
  setOpen,
  setTasks,
}) => {
  const ref = useRef<HTMLSelectElement>(null);
  const handleSubmit = (e: any) => {
    if (!ref.current) return;
    const selectedOption = ref.current.options[ref.current.selectedIndex];
    fetch(
      `${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/projects/update_state_task/${task.id}/`,
      {
        method: "PUT",
        body: selectedOption.value,
      },
    );

    setTasks((prev: any) =>
      prev.map((t: any) => {
        if (t.id === task.id) {
          t.state = +selectedOption.value;
        }
        return t;
      }),
    );

    setOpen(null);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2 items-center justify-center">
        <h1 className="font-bold">
          Modificar el estado de la tarea {task.name}
        </h1>
        <select
          id="state-selector"
          name="state"
          className="text-center flex-grow w-full rounded-md py-2 px-3 border-r-8 border-transparent"
          ref={ref}
        >
          <option value="0" className="text-yellow-500">
            Nuevo
          </option>
          <option value="1" className="text-blue-500">
            En Progreso
          </option>
          <option value="2" className="text-red-500">
            Bloqueado
          </option>
          <option value="3" className="text-black">
            Cerrado
          </option>
        </select>

        <button
          onClick={() => setOpen(null)}
          className="w-1/2 bg-red-400 hover:bg-red-500 font-bold text-white px-3 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="w-1/2 bg-sky-400 hover:bg-sky-500 font-bold text-white px-3 py-2 rounded-md"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

const PopUpPriority: React.FC<{
  task: TaskType;
  setOpen: any;
  setTasks: any;
}> = ({ task, setOpen, setTasks }) => {
  const ref = useRef<HTMLSelectElement>(null);

  const handleSubmit = (_: any) => {
    if (!ref.current) return;

    const selectedOption = ref.current.options[ref.current.selectedIndex];
    fetch(
      `${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/projects/update_priority_task/${task.id}/`,
      {
        method: "PUT",
        body: selectedOption.value,
      },
    );

    setTasks((prev: any) =>
      prev.map((t: any) => {
        if (t.id === task.id) {
          t.priority = +selectedOption.value;
        }
        return t;
      }),
    );

    setOpen(null);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2 items-center justify-center">
        <h1 className="font-bold">
          Modificar la prioridad de la tarea {task.name}
        </h1>
        <select
          id="state-selector"
          name="state"
          className={`w-full text-center rounded-md py-2 px-3 border-r-8 border-transparent`}
          ref={ref}
        >
          <option value="0" className="text-yellow-500">
            Baja
          </option>
          <option value="1" className="text-blue-500">
            Media
          </option>
          <option value="2" className="text-red-500">
            Alta
          </option>
        </select>
        <button
          onClick={() => setOpen(null)}
          className="w-1/2 bg-red-400 hover:bg-red-500 font-bold text-white px-3 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="w-1/2 bg-sky-400 hover:bg-sky-500 font-bold text-white px-3 py-2 rounded-md"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};
