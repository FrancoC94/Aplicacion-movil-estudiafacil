export function formatDate(dateInput) {
  const date = new Date(dateInput);
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(dateInput) {
  const date = new Date(dateInput);
  return `${formatDate(date)} ${date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
}

export function isVencida(fechaEntrega) {
  return new Date(fechaEntrega) < new Date();
}

export function diasRestantes(fechaEntrega) {
  const diff = new Date(fechaEntrega) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function truncate(text, maxLength = 80) {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}
