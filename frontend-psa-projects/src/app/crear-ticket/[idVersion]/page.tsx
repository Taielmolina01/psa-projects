"use client";
import { ClienteType } from "@/types";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const SOPORTE_URL = "https://soporte-wyq6.onrender.com";

export default function createTicket({
  params: { idVersion },
}: {
  params: { idVersion: Number };
}) {
  const [error, setError] = useState<string | null>();
  const [clientes, setClientes] = useState<ClienteType[]>([
    { idCliente: -1, razonSocial: "-", cuit: "-" },
  ]);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!idVersion) {
      return;
    }
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const json: any = {};
    formData.forEach((value, key) => (json[key] = value));

    let idCliente = parseInt(json["idCliente"]);

    json["fechaCreacion"] = formatDate(new Date());

    console.log(JSON.stringify(json));

    let res;
    try {
      res = await fetch(
        `${SOPORTE_URL}/tickets?idVersion=${idVersion}&idCliente=${idCliente}`,
        {
          method: "POST",
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
      if (res.status == 422) {
        setError("Porfavor ingresar una fecha válida");
      } else if (res.status == 400) {
        setError(data.detail);
      } else {
        setError("Error desconocido");
      }
      return;
    }

    router.push(`/version/${idVersion}`);
  };

  useEffect(() => {
    fetch(`${SOPORTE_URL}/clientes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const transformedData = data.map((cliente) => ({
            idCliente: cliente.id,
            razonSocial: cliente["razon social"],
            cuit: cliente.CUIT,
          }));
          setClientes(transformedData);
        }
      })
      .catch((_) => console.log("Error fetching clientes"));
  }, []);

  return (
    <div className="w-full py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl border-2 rounded-md py-8 px-10 border-gray-300 w-full mx-auto flex flex-col gap-3"
      >
        <h2 className="text-2xl  font-bold text-gray-900 ">Crear Ticket</h2>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Título del ticket
          </label>
          <input
            type="text"
            name="titulo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 "
            placeholder=""
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Cliente
          </label>
          <select
            name="idCliente"
            required
            className="py-2 px-3 border-r-8 border-transparent mb-2"
          >
            {clientes.map((c) => (
              <option key={c.idCliente} value={c.idCliente}>
                {c.razonSocial}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Descripción
          </label>
          <input
            type="text"
            name="descripcion"
            placeholder=""
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5 "
            required
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Severidad
          </label>
          <select
            name="severidad"
            className="p-2"
            id="severidad-selector"
            required
          >
            <option value={"S1"}>S1</option>
            <option value={"S2"}>S2</option>
            <option value={"S3"}>S3</option>
            <option value={"S4"}>S4</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Tipo
          </label>
          <select name="tipoTicket" className="p-2" id="tipo-selector" required>
            <option value={"ERROR"}>Error</option>
            <option value={"CONSULTA"}>Consulta</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Estado
          </label>
          <select
            name="estadoTicket"
            className="p-2"
            id="tipo-selector"
            required
          >
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

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}
