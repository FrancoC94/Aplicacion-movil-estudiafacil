// Expo only inlines environment variables prefixed with EXPO_PUBLIC_.
// Never use localhost for a physical device: it refers to the phone itself.
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000").replace(/\/$/, "");

export const STORAGE_KEYS = {
  // Expo SecureStore en Android solo acepta caracteres alfanuméricos, '.', '-',
  // y '_'. Evitar '@' y ':' permite persistir los tokens tras el registro.
  ACCESS_TOKEN: "estudiafacil_access_token",
  REFRESH_TOKEN: "estudiafacil_refresh_token",
  THEME: "estudiafacil_theme",
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
