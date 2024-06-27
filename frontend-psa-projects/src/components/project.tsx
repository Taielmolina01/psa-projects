"use client";

import Link from "next/link";
import SelectState from "./selectState";
import { ProjectType } from "@/types";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const URL_BACK_SUPPORT = "https://soporte-wyq6.onrender.com";

export const ProjectComponent: React.FC<{
  initialProjects: ProjectType[];
  legajoMap: Map<number, string>;
}> = ({ initialProjects, legajoMap }) => {
  const initialProjects_ = initialProjects;
  const [projects, setProjects] = useState<ProjectType[]>(initialProjects_);
  const [showedProjects, setShowedProjects] =
    useState<ProjectType[]>(initialProjects_);

  useEffect(() => {
    setShowedProjects((showedP) => {
      return projects.filter((project) => showedP.includes(project));
    });
  }, [projects]);

  return (
    <div className="flex flex-col gap-3">
      <ProjectFilter setProjects={setShowedProjects} projects={projects} />
      {showedProjects.map((project) => (
        <Project
          key={project.project_id}
          project={project}
          leaders={legajoMap}
          setProjects={setProjects}
        />
      ))}
    </div>
  );
};

export const Project: React.FC<{
  project: ProjectType;
  leaders: Map<number, string>;
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
}> = ({ project, leaders, setProjects }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: any) => {
    if (
      e.target.id != "state-selector" &&
      e.target.id != "delete-project" &&
      e.target.id != "edit-project"
    ) {
      console.log("Clicking on project", e.target);
      router.push(`/proyectos/${project.project_id}`);
    }
  };

  const deleteProject = () => {
    setLoading(true);
    fetch(
      `${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/projects/${project.project_id}/get_tasks/`,
    )
      .then((res) => res.json())
      .then((tasks) => {
        return Promise.all(
          tasks.map((task: any) =>
            fetch(`${URL_BACK_SUPPORT}/tareaTicket/tarea/${task.id}`, {
              method: "DELETE",
            }),
          ),
        );
      })
      .then(() => {
        return fetch(
          `${process.env.NEXT_PUBLIC_PROJECT_BACK_URL}/projects/${project.project_id}`,
          {
            method: "DELETE",
          },
        );
      })
      .then(() => {
        setProjects((previousProjects) =>
          previousProjects.filter(
            (previousProject) =>
              project.project_id != previousProject.project_id,
          ),
        );
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const editProject = () => {
    router.push(`/editar-proyecto/${project.project_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="w-full group flex justify-between items-center gap-2 bg-gray-200 border-2 border-gray-200 hover:border-gray-400 rounded-md p-3 cursor-pointer"
    >
      <div className="w-[30%]">
        <h3 className="text-lg font-bold text-sky-400">{project.name}</h3>
        <h5 className="text-xs text-gray-400">
          Fecha de inicio: {project.start_date}
        </h5>
        <h5 className="text-xs text-gray-400">
          Fecha de fin: {project.end_date}
        </h5>
        <h5 className="text-xs text-gray-400">
          Horas estimadas: {project.estimated_hours}
        </h5>
      </div>
      <h2 className="text-sm">Lider: {leaders.get(+project.file_leader)}</h2>
      <SelectState
        state={project.state}
        projectId={project.project_id}
        setProjects={setProjects}
      />
      <img
        onClick={editProject}
        id="edit-project"
        className="cursor-pointer flex items-center justify-center text-base w-5 h-5 transform transition-transform duration-200 hover:scale-110 rounded-sm"
        src="/pencil.png"
      ></img>
      {loading ? (
        <div className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-solid border-gray-900 align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] dark:border-gray-200 border-r-transparent dark:border-r-transparent" />
      ) : (
        <img
          onClick={deleteProject}
          id="delete-project"
          className="cursor-pointer flex items-center justify-center text-base w-5 h-5 transform transition-transform duration-200 hover:scale-110 rounded-sm"
          src="/trash.png"
        ></img>
      )}
    </div>
  );
};

export const ProjectFilter: React.FC<{
  projects: ProjectType[];
  setProjects: Dispatch<SetStateAction<ProjectType[]>>;
}> = ({ projects, setProjects }) => {
  const searchProject = (e: any) => {
    const search = e.target.value;
    const filteredProjects = projects.filter((project) =>
      project.name.includes(search),
    );
    setProjects(filteredProjects);
  };

  const filterState = (e: any) => {
    const state = e.target.value;
    if (state == "all") {
      setProjects(projects);
      return;
    }
    const filteredProjects = projects.filter(
      (project) => project.state == state,
    );
    setProjects(filteredProjects);
  };

  return (
    <div className="sm:w-full flex gap-3 justify-between">
      <input
        className="max-w-[45%] sm:max-w-none flex-grow border-2 rounded-md px-3 border-gray-200 hover:border-gray-500 focus:border-gray-500 focus:outline-none"
        type="text"
        placeholder="Encuentre un proyecto"
        onChange={searchProject}
      />
      <select
        id="state-selector"
        name="state"
        className="max-w-[30%] flex-grow rounded-md py-2 pl-1 border-2 border-gray-200 bg-gray-100 outline-none hover:border-gray-300"
        onChange={filterState}
      >
        <option value="all" className="text-black">
          Sin Filtro
        </option>
        <option value="0" className="text-yellow-500">
          Nuevo
        </option>
        <option value="1" className="text-blue-500">
          En Progreso
        </option>
        <option value="2" className="text-green-500">
          Esperando Cliente
        </option>
        <option value="3" className="text-sky-500">
          Esperando Desarrollo
        </option>
        <option value="4" className="text-purple-500">
          Esperando Confirmación
        </option>
        <option value="5" className="text-red-500">
          Bloqueado
        </option>
        <option value="6" className="text-black">
          Cerrado
        </option>
      </select>
      <Link
        href="/crear-proyecto"
        className="max-w-[25%] flex-grow text-center bg-sky-400 px-3 py-2 rounded-md text-white font-bold hover:bg-sky-600 active:bg-sky-800"
      >
        Crear
      </Link>
    </div>
  );
};
