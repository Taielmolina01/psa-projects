"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Spinner from "../../spinner";

const PROJ_BACK_URL = process.env.NEXT_PUBLIC_PROJECT_BACK_URL;

export default function editProject({
  params: { idProject },
}: {
  params: { idProject: string };
}) {
  const [error, setError] = useState<string | null>(null);
  const [foremans, setForemans] = useState<
    { legajo: number; Nombre: string; Apellido: string }[]
  >([]);
  const [project, setProject] = useState<{
    project_id: number;
    name: string;
    file_leader: number;
    end_date: string;
    start_date: string;
    estimated_hours: number;
    state: number;
  } | null>(null);
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!project) {
      return;
    }

    const formData = new FormData(e.currentTarget);

    const json = project as any;
    formData.forEach((value, key) => {
      if (key === "start_date" || key === "end_date") {
        const date = new Date(value.toString());
        const formattedDate = date.toISOString().split("T")[0]; // Formato YYYY-MM-DD
        json[key] = formattedDate;
      } else {
        json[key] = value;
      }
    });
    json["file_leader"] = parseInt(json["file_leader"], 10); // Asegurar que file_leader sea un entero

    let res;
    try {
      res = await fetch(
        `${PROJ_BACK_URL}/projects/update_project/${idProject}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(json),
        },
      );
    } catch (e) {
      setError("Error de conexión");
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      if (res.status === 422) {
        setError("Ingresar una fecha válida");
      } else if (res.status === 400) {
        setError(data.detail);
      } else {
        setError("Error desconocido");
      }
      return;
    }

    router.push("/proyectos/" + idProject);
  };

  useEffect(() => {
    // Cargar datos del proyecto existente
    fetch(`${PROJ_BACK_URL}/projects/${idProject}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
      })
      .catch((_) => console.log("Error fetching project details"));

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

  if (!project) {
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
        <h2 className="text-2xl font-bold text-gray-900 ">Editar proyecto</h2>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Nombre del proyecto
          </label>
          <input
            type="text"
            name="name"
            defaultValue={project.name}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label className="block mb-2  text-sm font-medium text-gray-900">
            Líder
          </label>
          <select
            name="file_leader"
            defaultValue={project.file_leader}
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
            defaultValue={project.start_date}
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
            defaultValue={project.end_date}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5"
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Horas estimadas
          </label>
          <input
            type="number"
            name="estimated_hours"
            defaultValue={project.estimated_hours}
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
