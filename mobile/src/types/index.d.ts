export type EstadoTarea = "pendiente" | "en_progreso" | "completada";
export type PrioridadTarea = "baja" | "media" | "alta";

export interface User {
  id: number;
  nombre: string;
  email: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Materia {
  id: number;
  nombre: string;
  profesor?: string;
  color: string;
  creditos?: number;
  usuario_id: number;
  created_at: string;
}

export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  fecha_entrega: string;
  estado: EstadoTarea;
  prioridad: PrioridadTarea;
  materia_id: number;
  created_at: string;
}

export interface Notificacion {
  id: number;
  usuario_id: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
}
