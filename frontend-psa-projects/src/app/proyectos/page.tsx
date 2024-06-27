import { ProjectComponent } from "@/components/project";
import { ProjectType } from "@/types";

const PROJ_BACK_URL = process.env.NEXT_PUBLIC_PROJECT_BACK_URL;

export default async function Proyectos() {
  const res = await fetch(`${PROJ_BACK_URL}/projects`, {
    cache: "no-cache",
  });
  const projects = (await res.json()) as ProjectType[];

  const foremans = await fetch(`${PROJ_BACK_URL}/foremans`)
    .then((res) => res.json())
    .catch((e) => console.log("Error fetching foremans"));

  const legajoMap = new Map();

  foremans.forEach((item: any) => {
    legajoMap.set(item.legajo, `${item.Nombre} ${item.Apellido}`);
  });

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="pt-5 w-1/2 flex flex-col gap-3 items-center pb-4">
        <ProjectComponent legajoMap={legajoMap} initialProjects={projects} />
      </div>
    </div>
  );
}
