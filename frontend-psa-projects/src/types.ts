export type ProjectType = {
  project_id: number;
  name: string;
  file_leader: number;
  end_date: string;
  start_date: string;
  estimated_hours: number;
  state: number;
};

export type TaskType = {
  id: number;
  project_id: number;
  name: string;
  requirements: string;
  file_foreman: number;
  priority: number;
  state: number;
  start_date: string;
  end_date: string;
};

export type ForemanType = {
  legajo: number;
  Nombre: string;
  Apellido: string;
};

/*Soporte*/
export type TicketType = {
  idTicket: number;
  titulo: string;
  fechaCreacion: string;
  severidad: string;
  estadoTicket: string;
  tipoTicket: string;
  descripcion: string;
  idCliente: number;
  idVersion: number;
};

export type ClienteType = {
  idCliente: number;
  razonSocial: string;
  cuit: string;
};

export type VersionType = {
  idVersion: number;
  idProducto: number;
  nombre: string;
};
