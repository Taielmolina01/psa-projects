export function getSeverityColor(severity: string) {
  switch (severity) {
    case "S1":
    case "S2":
      return "text-red-500";
    case "S3":
      return "text-yellow-500";
    case "S4":
      return "text-green-500";
    default:
      return "text-gray-500";
  }
}

export function getTipoColor(tipo: string) {
  switch (tipo) {
    case "ERROR":
      return "text-red-500";
    case "CONSULTA":
      return "text-gray-500";
    default:
      return "text-gray-500";
  }
}

export function getEstadoColor(estado: string) {
  switch (estado) {
    case "NUEVO":
      return "text-green-500";
    case "EN_PROGRESO":
      return "text-yellow-500";
    case "ESPERANDO_CLIENTE":
      return "text-blue-500";
    case "ESPERANDO_DESARROLLO":
      return "text-blue-500";
    case "RESUELTO_ESPERANDO_CONFIRMACION":
      return "text-green-500";
    case "CERRADO":
      return "text-red-500";
    case "BLOQUEADO":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}
