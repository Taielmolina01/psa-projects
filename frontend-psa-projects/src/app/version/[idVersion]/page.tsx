"use client";

import { useEffect, useState } from "react";
import { VersionType } from "@/types.ts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";
import {
  getEstadoColor,
  getSeverityColor,
  getTipoColor,
} from "@/app/detalleTicket/funcionesColores.tsx";
import Spinner from "../../spinner";

const SOPORTE_URL = "https://soporte-wyq6.onrender.com";

function Producto({
  params: { idVersion },
}: {
  params: { idVersion: string };
}) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [version, setVersion] = useState<VersionType | null>(null);
  const [producto, setProducto] = useState<any | null>(null);
  const [clients, setClients] = useState<Record<number, string>>({});
  const [filterState, setFilterState] = useState<string>("-1");
  const [filterSeverity, setFilterSeverity] = useState<string>("-1");
  const [filterType, setFilterType] = useState<string>("-1");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchTicketsAndClients = async () => {
      try {
        const ticketsResponse = await fetch(
          `${SOPORTE_URL}/versions/${idVersion}/tickets`,
          { cache: "no-store" },
        );
        const ticketsData = await ticketsResponse.json();
        setTickets(ticketsData);
        setFilteredTickets(ticketsData);

        const clientsResponse = await fetch(`${SOPORTE_URL}/clientes`, {
          cache: "no-store",
        });
        const clientsData = await clientsResponse.json();
        const clientsMap = clientsData.reduce((acc: any, client: any) => {
          acc[client.id] = client["razon social"];
          return acc;
        }, {});
        setClients(clientsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsAndClients();
  }, [idVersion]);

  useEffect(() => {
    fetch(`${SOPORTE_URL}/versions/${idVersion}`)
      .then((res) => res.json())
      .then(async (versionData) => {
        setVersion(versionData);
        const productoResponse = await fetch(
          `${SOPORTE_URL}/productos/${versionData.idProducto}`,
          { cache: "no-store" },
        );
        const productoData = await productoResponse.json();
        setProducto(productoData);
      })
      .catch((error) =>
        console.log("Error fetching version or product:", error),
      );
  }, [idVersion]);

  const handleDelete = (idTicket: number) => {
    fetch(`${SOPORTE_URL}/tickets/${idTicket}`, {
      method: "DELETE",
      cache: "no-store",
    })
      .then((response) => {
        if (response.ok) {
          setTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.idTicket !== idTicket),
          );
          setFilteredTickets((prevTickets) =>
            prevTickets.filter((ticket) => ticket.idTicket !== idTicket),
          );
        } else {
          console.error("Error deleting ticket:", response.statusText);
        }
      })
      .catch((error) => console.error("Error deleting ticket:", error));
  };

  const handleFilterStateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFilter = event.target.value;
    setFilterState(selectedFilter);
    filterTickets(selectedFilter, filterSeverity, filterType, searchTerm);
  };

  const handleFilterSeverityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFilter = event.target.value;
    setFilterSeverity(selectedFilter);
    filterTickets(filterState, selectedFilter, filterType, searchTerm);
  };

  const handleFilterTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedFilter = event.target.value;
    setFilterType(selectedFilter);
    filterTickets(filterState, filterSeverity, selectedFilter, searchTerm);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    filterTickets(filterState, filterSeverity, filterType, searchTerm);
  };

  const filterTickets = (
    selectedState: string,
    selectedSeverity: string,
    selectedType: string,
    searchTerm: string,
  ) => {
    let filtered = tickets;
    if (selectedState !== "-1") {
      filtered = filtered.filter(
        (ticket) => ticket.estadoTicket === selectedState,
      );
    }
    if (selectedSeverity !== "-1") {
      filtered = filtered.filter(
        (ticket) => ticket.severidad === selectedSeverity,
      );
    }
    if (selectedType !== "-1") {
      filtered = filtered.filter(
        (ticket) => ticket.tipoTicket === selectedType,
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((ticket) =>
        ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredTickets(filtered);
  };

  if (loading) {
    return (
      <div className="w-full py-5 max-w-3xl text-sm flex flex-col gap-2 transition-s items-center">
        {" "}
        <Spinner />{" "}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto text-sm flex flex-col gap-2 items-center pb-4">
      <h2 className="pt-5 text-2xl font-bold text-gray-900">
        {producto?.nombre} : {version?.nombre}
      </h2>
      <h4 className="text-lg font-semibold text-gray-400">Producto: versión</h4>
      <div className="w-full flex gap-3 justify-between">
        <input
          className="flex-grow border-2 rounded-md px-3 border-gray-200 hover:border-gray-500 focus:border-gray-500 focus:outline-none"
          type="text"
          placeholder="Encuentre un ticket"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <select
          onChange={handleFilterStateChange}
          className="rounded-md py-2 pl-1 border-2 border-gray-200 bg-gray-100 outline-none hover:border-gray-300"
          defaultValue="-1"
        >
          <option value="-1">Estado</option>
          <option value={"NUEVO"}>Nuevo</option>
          <option value={"EN_PROGRESO"}>En progreso</option>
          <option value={"ESPERANDO_CLIENTE"}>Esperando cliente</option>
          <option value={"ESPERANDO_DESARROLLO"}>Esperando desarrollo</option>
          <option value={"RESUELTO_ESPERANDO_CONFIRMACION"}>
            Resuelto esperando confirmación
          </option>
          <option value={"CERRADO"}>Cerrado</option>
          <option value={"BLOQUEADO"}>Bloqueado</option>
        </select>
        <select
          onChange={handleFilterSeverityChange}
          className="rounded-md py-2 pl-1 border-2 border-gray-200 bg-gray-100 outline-none hover:border-gray-300"
          defaultValue="-1"
        >
          <option value="-1">Severidad</option>
          <option value={"S1"}>S1</option>
          <option value={"S2"}>S2</option>
          <option value={"S3"}>S3</option>
          <option value={"S4"}>S4</option>
        </select>
        <select
          onChange={handleFilterTypeChange}
          className="rounded-md py-2 pl-1 border-2 border-gray-200 bg-gray-100 outline-none hover:border-gray-300"
          defaultValue="-1"
        >
          <option value="-1">Tipo</option>
          <option value={"CONSULTA"}>Consulta</option>
          <option value={"ERROR"}>Error</option>
        </select>
      </div>

      <Link
        className="w-full border-2 rounded-md border-sky-400 text-sky-400 text-center py-1 hover:bg-sky-400 hover:text-white hover:font-bold"
        href={`/crear-ticket/${idVersion}`}
      >
        + Agregar Ticket
      </Link>

      <TicketTable
        tickets={filteredTickets}
        clients={clients}
        handleDelete={handleDelete}
      />
    </div>
  );
}

export default Producto;

const TicketTable = ({
  tickets,
  clients,
  handleDelete,
}: {
  tickets: any[];
  clients: Record<number, string>;
  handleDelete: (idTicket: number) => void;
}) => {
  const router = useRouter();

  const handleClick = (e: any, idTicket: string) => {
    router.push(`/detalleTicket/${idTicket}`);
  };

  return (
    <>
      <table className="w-full">
        <thead className="bg-sky-400 flex w-full border-2 border-gray-100 text-white rounded-md">
          <tr className="flex w-full">
            <th className="p-2 w-1/6">Título</th>
            <th className="p-2 w-1/6">Estado</th>
            <th className="p-2 w-1/6">Severidad</th>
            <th className="p-2 w-1/6">Tipo</th>
            <th className="p-2 w-1/6">Cliente</th>
            <th className="p-2 w-1/6">Eliminar</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {tickets.map((ticket) => (
            <tr
              key={ticket.idTicket}
              className="mb-1 flex items-center w-full border-2 border-gray-100 hover:border-gray-500 odd:bg-gray-300 even:bg-gray-100 transition-all cursor-pointer rounded-md"
              onClick={(e) => handleClick(e, ticket.idTicket)}
            >
              <td className="p-2 w-1/6">{ticket.titulo}</td>
              <td
                className={`p-2 w-1/6 text-center ${getEstadoColor(ticket.estadoTicket)}`}
              >
                {formatEstado(ticket.estadoTicket)}
              </td>
              <td
                className={`p-2 w-1/6 text-center ${getSeverityColor(ticket.severidad)}`}
              >
                {ticket.severidad}
              </td>
              <td
                className={`p-2 w-1/6 text-center ${getTipoColor(ticket.tipoTicket)}`}
              >
                {ticket.tipoTicket}
              </td>
              <td className="p-2 w-1/6 text-center">
                {clients[ticket.idCliente]}
              </td>
              <td className="p-2 w-1/6 text-center">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(ticket.idTicket);
                  }}
                  className="cursor-pointer m-auto flex items-center justify-center text-base w-5 h-5 transform transition-transform duration-200 hover:scale-110 rounded-sm"
                >
                  <img src="/trash.png" alt="Eliminar"></img>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const formatEstado = (estado: string) => {
  return (
    estado.charAt(0).toUpperCase() +
    estado.slice(1).replaceAll("_", " ").toLowerCase()
  );
};
