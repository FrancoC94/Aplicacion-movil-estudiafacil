import apiClient from "./client";

// Endpoint público, útil para verificar que el dispositivo alcanza la API.
export const HealthAPI = {
  check: () => apiClient.get("/health"),
};

export const AuthAPI = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (email, password) => {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    return apiClient.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  },
};

export const UserAPI = {
  getMe: () => apiClient.get("/users/me"),
  updateMe: (data) => apiClient.put("/users/me", data),
  deleteMe: () => apiClient.delete("/users/me"),
};

export const MateriasAPI = {
  list: () => apiClient.get("/materias"),
  get: (id) => apiClient.get(`/materias/${id}`),
  create: (data) => apiClient.post("/materias", data),
  update: (id, data) => apiClient.put(`/materias/${id}`, data),
  remove: (id) => apiClient.delete(`/materias/${id}`),
};

export const TareasAPI = {
  list: () => apiClient.get("/tareas"),
  get: (id) => apiClient.get(`/tareas/${id}`),
  create: (data) => apiClient.post("/tareas", data),
  update: (id, data) => apiClient.put(`/tareas/${id}`, data),
  remove: (id) => apiClient.delete(`/tareas/${id}`),
};

export const RecordatoriosAPI = {
  create: (data) => apiClient.post("/recordatorios", data),
};

export const NotificacionesAPI = {
  list: () => apiClient.get("/notificaciones"),
  marcarLeida: (id) => apiClient.patch(`/notificaciones/${id}/leida`),
};
