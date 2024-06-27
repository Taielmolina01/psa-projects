"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Spinner from "../../spinner";

const PROJ_BACK_URL = process.env.NEXT_PUBLIC_PROJECT_BACK_URL;

export default function editTask({
  params: { idTask },
}: {
  params: { idTask: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [foremans, setForemans] = useState<
    { legajo: number; Nombre: string; Apellido: string }[]
  >([]);
  const [task, setTask] = useState<{
    id: number;
    project_id: number;
    name: string;
    requirements: string;
    file_foreman: number;
    priority: number;
    state: number;
    start_date: string;
    end_date: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!task) {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const json = task as any;
    formData.forEach((value, key) => {
      if (key === "start_date" || key === "end_date") {
        const date = new Date(value.toString());
        const formattedDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
        json[key] = formattedDate;
      } else {
        json[key] = value;
      }
    });

    let res;
    try {
      res = await fetch(`${PROJ_BACK_URL}/projects/update_task/${idTask}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });
    } catch (e) {
      setError("Error de conexión");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      if (res.status == 422) {
        setError("Ingresar una fecha válida");
      } else if (res.status == 400) {
        setError(data.detail);
      } else {
        setError("Error desconocido");
      }
      return;
    }

    router.push("/proyectos/" + task.project_id);
  };

  useEffect(() => {
    // Cargar datos de la tarea existente
    console.log(idTask);
    fetch(`${PROJ_BACK_URL}/projects/get_task/${idTask}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTask(data);
      })
      .catch((_) => console.log("Error fetching task details"));

    // Cargar lista de foremans
    fetch(`${PROJ_BACK_URL}/foremans`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setForemans(data);
        }
      })
      .catch((_) => console.log("Error fetching foremans"));
  }, []);

  if (!task) {
    return (
      <div className="w-full py-5 max-w-3xl text-sm flex flex-col gap-2 transition-s items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl border-2 rounded-md py-8 px-10 border-gray-300 w-full mx-auto flex flex-col gap-3"
      >
        <h2 className="text-2xl font-bold text-gray-900 ">Editar tarea</h2>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Nombre de la tarea
          </label>
          <input
            type="text"
            name="name"
            defaultValue={task.name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label className="block mb-2  text-sm font-medium text-gray-900">
            Responsable
          </label>
          <select
            name="file_foreman"
            defaultValue={task.file_foreman}
            required
            className="px-2 py-2 mb-2 rounded-md border-2 border-gray-200"
          >
            {foremans.map((f) => (
              <option key={f.legajo} value={f.legajo}>
                {f.Nombre} {f.Apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Fecha de inicio
          </label>
          <input
            type="date"
            name="start_date"
            defaultValue={task.start_date}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Fecha de fin
          </label>
          <input
            type="date"
            name="end_date"
            defaultValue={task.end_date}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="text-white bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
