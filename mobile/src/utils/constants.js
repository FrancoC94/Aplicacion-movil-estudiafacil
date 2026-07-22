export const API_URL = process.env.API_URL || "http://localhost:8000";

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "@estudiafacil:access_token",
  REFRESH_TOKEN: "@estudiafacil:refresh_token",
  THEME: "@estudiafacil:theme",
};

export const ESTADOS_TAREA = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_progreso", label: "En progreso" },
  { value: "completada", label: "Completada" },
];

export const PRIORIDADES_TAREA = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
];
