import { ChangeEvent, useEffect, useRef, useState } from "react";

const PROJ_BACK_URL = process.env.NEXT_PUBLIC_PROJECT_BACK_URL;

const SelectState: React.FC<{
  projectId: number;
  state: number;
  setProjects: any;
}> = ({ projectId, setProjects, state }) => {
  const [selectedClass, setSelectedClass] = useState<string>("text-black");
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const selectedOption = event.target.options[event.target.selectedIndex];

    fetch(
      `${PROJ_BACK_URL}/projects/update_state_project/${projectId}?new_state=${+selectedOption.value}`,
      {
        method: "PUT",
      },
    );

    setProjects((prev: any) => {
      return prev.map((project: any) => {
        if (project.project_id == projectId) {
          project.state = +selectedOption.value;
        }
        return project;
      });
    });

    setSelectedClass(selectedOption.className);
  };

  useEffect(() => {
    if (selectRef.current) {
      const selectedOption =
        selectRef.current.options[selectRef.current.selectedIndex];
      setSelectedClass(selectedOption.className);
    }
  }, []);

  return (
    <select
      id="state-selector"
      name="state"
      ref={selectRef}
      defaultValue={state}
      className={`max-w-[30%] text-sm flex-grow rounded-md py-2 px-3 border-r-8 border-transparent bg-gray-100 outline-none ${selectedClass}`}
      onChange={handleChange}
    >
      <option id="state-selector" value="0" className="text-yellow-500">
        Nuevo
      </option>
      <option id="state-selector" value="1" className="text-blue-500">
        En Progreso
      </option>
      <option id="state-selector" value="2" className="text-green-500">
        Esperando Cliente
      </option>
      <option id="state-selector" value="3" className="text-sky-500">
        Esperando Desarrollo
      </option>
      <option id="state-selector" value="4" className="text-purple-500">
        Esperando Confirmación
      </option>
      <option id="state-selector" value="5" className="text-red-500">
        Bloqueado
      </option>
      <option id="state-selector" value="6" className="text-black">
        Cerrado
      </option>
    </select>
  );
};

export default SelectState;
