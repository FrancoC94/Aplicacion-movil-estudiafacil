import { TareasAPI, MateriasAPI } from "../api/endpoints";
import { storageService } from "./storageService";

const CACHE_KEYS = { TAREAS: "cache:tareas", MATERIAS: "cache:materias" };

/**
 * Servicio simple de sincronización offline:
 * intenta traer datos frescos del servidor y, si falla (sin conexión),
 * regresa la última copia guardada localmente.
 */
export const syncService = {
  async getTareas() {
    try {
      const { data } = await TareasAPI.list();
      await storageService.set(CACHE_KEYS.TAREAS, data);
      return data;
    } catch {
      return (await storageService.get(CACHE_KEYS.TAREAS)) || [];
    }
  },

  async getMaterias() {
    try {
      const { data } = await MateriasAPI.list();
      await storageService.set(CACHE_KEYS.MATERIAS, data);
      return data;
    } catch {
      return (await storageService.get(CACHE_KEYS.MATERIAS)) || [];
    }
  },
};
