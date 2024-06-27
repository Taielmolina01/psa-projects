"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ClienteType, TicketType, TaskType } from "@/types.ts";
import {
  getEstadoColor,
  getSeverityColor,
  getTipoColor,
} from "@/app/detalleTicket/funcionesColores.tsx";
import Spinner from "../../spinner";
import { useRouter } from "next/navigation";

const SOPORTE_URL = "https://soporte-wyq6.onrender.com";
const PROJECTS_URL = "https://backend-psa-projects.onrender.com";

function DetalleTicket({
  params: { idTicket },
}: {
  params: { idTicket: string };
}) {
  const [ticket, setTicket] = useState<TicketType | null>(null);
  const [cliente, setCliente] = useState<ClienteType | null>(null);
  const [tareas, setTareas] = useState<TaskType[]>([]);

  useEffect(() => {
    // Fetch ticket data
    fetch(`${SOPORTE_URL}/tickets/${idTicket}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((ticketData) => {
        setTicket(ticketData);
        // Fetch client data once ticket data is available
        return fetch(`${SOPORTE_URL}/clientes/${ticketData.idCliente}`, {
          cache: "no-store",
        });
      })
      .then((res) => res.json())
      .then((clienteData) => setCliente(mapCliente(clienteData)))
      .catch((_) => console.log("Error fetching ticket or client data"));

    // Fetch tasks associated with the ticket
    fetch(`${SOPORTE_URL}/tareaTicket/ticket/${idTicket}`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then(async (relations) => {
        const tareasPromises = relations.map(
          (relation: { idTarea: number }) => {
            return fetch(
              `${PROJECTS_URL}/projects/get_task/${relation.idTarea}/`,
              { cache: "no-store" },
            ).then((res) => res.json());
          },
        );
        const tareasData = await Promise.all(tareasPromises);
        setTareas(tareasData);
      })
      .catch((_) => console.log("Error fetching tasks data"));
  }, [idTicket]);

  const handleUnlink = (idTarea: number, idTicket: number) => {
    fetch(`${SOPORTE_URL}/tareaTicket/${idTarea}/${idTicket}`, {
      method: "DELETE",
      cache: "no-store",
    })
      .then((response) => {
        if (response.ok) {
          setTareas((prevTareas) =>
            prevTareas.filter((tarea) => tarea.id !== idTarea),
          );
        } else {
          console.error("Error unlinking task:", response.statusText);
        }
      })
      .catch((error) => console.error("Error unlinking task:", error));
  };

  return (
    <>
      {ticket ? (
        <div className="w-full max-w-3xl flex flex-col gap-3 mx-auto p-6 bg-gray-200 shadow-md rounded-lg mt-10">
          <h1 className="text-3xl font-bold text-center">{ticket.titulo}</h1>
          <div className="w-full flex gap-[4rem] justify-between text-xl font-semibold">
            <div className="flex">
              <span>Tipo:</span>
              <span className={`${getTipoColor(ticket.tipoTicket)}`}>
                {ticket.tipoTicket}
              </span>
            </div>
            <div className="flex ">
              <span>Fecha de creación:</span>
              <span className="ml-1">
                {new Date(ticket.fechaCreacion).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between text-xl font-semibold">
            <div className="flex">
              <span>Estado:</span>
              <span className={`ml-1 ${getEstadoColor(ticket.estadoTicket)}`}>
                {formatEstado(ticket.estadoTicket)}
              </span>
            </div>
            <div className="flex">
              <span>Cliente:</span>
              <span className="ml-1">{cliente?.razonSocial}</span>
            </div>
          </div>
          <div className="w-full flex justify-between text-xl font-semibold mb-4">
            <div className="flex col-span-1">
              <span>Severidad:</span>
              <span className={`ml-1 ${getSeverityColor(ticket.severidad)}`}>
                {ticket.severidad}
              </span>
            </div>
          </div>
          <div className="">
            <h2 className="text-xl font-semibold">Descripción:</h2>
            <div className="p-4 border rounded-md mt-2 border-gray-500">
              {ticket.descripcion}
            </div>
          </div>
          <div className="">
            <h2 className="text-xl font-semibold">Tareas</h2>
          </div>
          <Link
            className="w-full border-2 block rounded-md border-sky-400 text-sky-400 text-center py-1 hover:bg-sky-400 hover:text-white hover:font-bold"
            href={`/crear-tarea-ticket/${ticket.idTicket}`}
          >
            + Agregar Tarea
          </Link>
          <TareaTable
            tareas={tareas}
            idTicket={ticket.idTicket}
            handleUnlink={handleUnlink}
          />
          <div className="text-center">
            <Link href={`/editar-ticket/${ticket.idTicket}`}>
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                Editar Ticket
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="w-full py-5 max-w-3xl text-sm flex flex-col gap-2 transition-s items-center">
          <Spinner />
        </div>
      )}
    </>
  );
}

const TareaTable = ({
  tareas,
  idTicket,
  handleUnlink,
}: {
  tareas: any[];
  idTicket: number;
  handleUnlink: (idTarea: number, idTicket: number) => void;
}) => {
  const router = useRouter();

  const handleClick = (e: any, idProyecto: string) => {
    router.push(`/proyectos/${idProyecto}`);
  };

  return (
    <table className="w-full mt-4">
      <thead className="bg-sky-400 border-2 border-gray-100 text-white rounded-md">
        <tr>
          <th className="w-1/4 p-2">Nombre</th>
          <th className="w-1/4 p-2">Estado</th>
          <th className="w-1/4 p-2">Prioridad</th>
          <th className="w-1/4 p-2">Desvincular</th>
        </tr>
      </thead>
      <tbody className="w-full">
        {tareas.map((tarea, i) => (
          <tr
            key={i}
            className="mb-1 items-center border-2 border-gray-100 hover:border-gray-500 odd:bg-gray-300 even:bg-gray-100 transition-all cursor-pointer rounded-md"
            onClick={(e) => handleClick(e, tarea.project_id)}
          >
            <td className="p-2">{tarea.name}</td>
            <td className="p-2 text-center">
              {(() => {
                switch (tarea.state) {
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
            </td>
            <td className="p-2 text-center">
              {(() => {
                switch (tarea.priority) {
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
            </td>
            <td className="p-2 text-center">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleUnlink(tarea.id, idTicket);
                }}
                className="cursor-pointer m-auto flex items-center justify-center text-base w-5 h-5 transform transition-transform duration-200 hover:scale-110 rounded-sm"
              >
                <img src="/unlink.png"></img>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function mapCliente(clienteData: any): ClienteType {
  return {
    idCliente: clienteData.idCliente,
    razonSocial: clienteData["razon social"],
    cuit: clienteData.cuit,
  };
}

const formatEstado = (estado: string) => {
  return (
    estado.charAt(0).toUpperCase() +
    estado.slice(1).replaceAll("_", " ").toLowerCase()
  );
};

export default DetalleTicket;
