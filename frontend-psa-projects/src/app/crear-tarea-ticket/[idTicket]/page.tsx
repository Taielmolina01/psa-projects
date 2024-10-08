"use client";
import { ForemanType, ProjectType } from "@/types";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const SOPORTE_URL = "https://soporte-wyq6.onrender.com";
const PROJ_BACK_URL = "https://backend-psa-projects.onrender.com";

export default function createTask({
  params: { idTicket },
}: {
  params: { idTicket: Number };
}) {
  const [error, setError] = useState<string | null>(null);
  const [foremans, setForemans] = useState<ForemanType[]>([
    { legajo: -1, Nombre: "Cargando", Apellido: "" },
  ]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectType[]>([]);
  const [projectSearch, setProjectSearch] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetch(`${PROJ_BACK_URL}/foremans`)
      .then((res) => res.json())
      .then((data) => {
        if (data instanceof Array) {
          setForemans(data as ForemanType[]);
        }
      })
      .catch((_) => console.log("Error fetching foremans"));

    fetch(`${PROJ_BACK_URL}/projects`)
      .then((res) => res.json())
      .then((data) => {
        if (data instanceof Array) {
          setProjects(data as ProjectType[]);
          setFilteredProjects(data as ProjectType[]);
        }
      })
      .catch((_) => console.log("Error fetching projects"));
  }, []);

  useEffect(() => {
    if (projectSearch.trim() === "") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) =>
          project.name.toLowerCase().includes(projectSearch.toLowerCase()),
        ),
      );
    }
  }, [projectSearch, projects]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!idTicket) {
      return;
    }
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const json: any = {};
    formData.forEach((value, key) => {
      if (key === "start_date" || key === "end_date") {
        const date = new Date(value.toString());
        const formattedDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
        json[key] = formattedDate;
      } else {
        json[key] = value;
      }
    });

    const projectId = json["project_id"];

    let res;
    try {
      res = await fetch(`${PROJ_BACK_URL}/projects/${projectId}/create_task`, {
        method: "POST",
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

    const taskData = await res.json();
    const taskId = taskData.id;

    try {
      const soporteRes = await fetch(`${SOPORTE_URL}/tareaTicket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idTarea: taskId,
          idTicket: idTicket,
        }),
      });

      if (!soporteRes.ok) {
        setError("Error al asociar la tarea con el ticket en SOPORTE.");
        return;
      }
    } catch (e) {
      setError("Error de conexión con SOPORTE.");
      return;
    }

    router.push(`/detalleTicket/${idTicket}`);
  };

  return (
    <div className="w-full py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl border-2 rounded-md py-8 px-10 border-gray-300 w-full mx-auto flex flex-col gap-3"
      >
        <h2 className="text-2xl  font-bold text-gray-900 ">Crear tarea</h2>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Nombre de la tarea
          </label>
          <input
            type="text"
            name="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 "
            placeholder=""
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Proyecto
          </label>
          <input
            type="text"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 mb-2"
            placeholder="Buscar proyecto"
          />
          <select
            name="project_id"
            required
            className="w-full py-2 px-3 border-r-8 border-transparent mb-2"
          >
            {filteredProjects.map((project) => (
              <option key={project.project_id} value={project.project_id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Responsable
          </label>
          <select
            name="file_foreman"
            required
            className="py-2 px-3 border-r-8 border-transparent mb-2"
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
            placeholder="YYYY-MM-DD"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 "
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
            placeholder="YYYY-MM-DD"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 "
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Estado Inicial
          </label>
          <select name="state" className="p-2" id="state-selector" required>
            <option value={0}>Nuevo</option>
            <option value={1}>En progreso</option>
            <option value={2}>Bloqueado</option>
            <option value={3}>Cerrado</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Prioridad
          </label>
          <select name="priority" className="p-2" id="state-selector" required>
            <option value={0}>Baja</option>
            <option value={1}>Media</option>
            <option value={2}>Alta</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="text-white bg-sky-400 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-500 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
        >
          Crear
        </button>
      </form>
    </div>
  );
}
